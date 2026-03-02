import { makeAutoObservable, runInAction } from "mobx";
import type { User } from "../types/user.types";

type AuthSession = {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
};

const AUTH_STORAGE_KEY = "authSession";
const DEFAULT_API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "";
const DEFAULT_GOOGLE_AUTH_PATH = "/auth/google";
const DEFAULT_ME_PATH = "/auth/me";

type MeResponse = {
    user: User;
};

export class AuthStore {
    user: User | null = null;
    accessToken: string | null = null;
    refreshToken: string | null = null;

    loading: boolean = false;
    error: string | null = null;

    drawerOpened: boolean = false;

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
        this.loadLocalSession();
    }

    get isAuthenticated(): boolean {
        // For OAuth session-cookie flow, user presence is enough.
        return this.user !== null || this.accessToken !== null;
    }

    get googleAuthUrl(): string {
        return this.buildApiUrl(DEFAULT_GOOGLE_AUTH_PATH);
    }

    setLoading(loading: boolean) {
        this.loading = loading;
    }

    setError(error: string | null) {
        this.error = error;
    }

    setUser(user: User | null) {
        this.user = user;
        this.saveLocalSession();
    }

    setTokens(accessToken: string | null, refreshToken: string | null = null) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.saveLocalSession();
    }

    login(user: User, accessToken: string, refreshToken: string | null = null) {
        this.user = user;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.error = null;
        this.saveLocalSession();
    }

    logout() {
        this.user = null;
        this.accessToken = null;
        this.refreshToken = null;
        this.error = null;
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }

    startGoogleOAuth(returnTo?: string) {
        console.log(this.googleAuthUrl)
        const authUrl = new URL(this.googleAuthUrl);
        if (returnTo) {
            authUrl.searchParams.set("returnTo", returnTo);
        }
        window.location.assign(authUrl.toString());
    }

    async bootstrapAuth() {
        const processed = await this.handleOAuthCallbackFromUrl();
        if (processed) return;

        if (this.user) return;

        try {
            await this.fetchMe();
        } catch {
            // No active session is a valid state.
        }
    }

    async fetchMe(path: string = DEFAULT_ME_PATH) {
        this.setLoading(true);
        this.setError(null);

        try {
            console.log('try me')
            const response = await fetch(this.buildApiUrl(path), {
                method: "GET",
                credentials: "include",
                headers: this.accessToken ? { Authorization: `Bearer ${this.accessToken}` } : undefined,
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch user: ${response.status}`);
            }

            const data = (await response.json()) as MeResponse | User;
            console.log(data)
            const user = "user" in data ? data.user : data;
            this.setUser(user);
        } catch (error) {
            this.setError(error instanceof Error ? error.message : "Failed to fetch user");
            throw error;
        } finally {
            this.setLoading(false);
        }
    }

    async handleOAuthCallbackFromUrl(url: string = window.location.href) {
        const callbackUrl = new URL(url);
        const params = callbackUrl.searchParams;
        const hashParams = new URLSearchParams(callbackUrl.hash.startsWith("#") ? callbackUrl.hash.slice(1) : callbackUrl.hash);

        const error = params.get("error") ?? hashParams.get("error");
        const errorDescription = params.get("error_description") ?? hashParams.get("error_description");
        if (error) {
            this.setError(errorDescription ?? error);
            return false;
        }

        const accessToken =
            params.get("access_token") ??
            hashParams.get("access_token") ??
            params.get("accessToken") ??
            hashParams.get("accessToken") ??
            params.get("token") ??
            hashParams.get("token");
        const refreshToken =
            params.get("refresh_token") ??
            hashParams.get("refresh_token") ??
            params.get("refreshToken");

        const userParam = params.get("user") ?? hashParams.get("user");
        const hasAuthCode = !!(params.get("code") ?? hashParams.get("code"));
        let parsedUser: User | null = null;

        if (userParam) {
            parsedUser = this.parseUserFromQuery(userParam);
        }

        if (accessToken) {
            this.setTokens(accessToken, refreshToken);
        }

        if (parsedUser) {
            this.setUser(parsedUser);
            this.clearAuthParamsFromUrl(callbackUrl);
            return true;
        }

        if (accessToken || hasAuthCode) {
            try {
                await this.fetchMe();
                this.clearAuthParamsFromUrl(callbackUrl);
                return true;
            } catch {
                this.clearAuthParamsFromUrl(callbackUrl);
                return true;
            }
        }

        return false;
    }

    toJSON(): AuthSession {
        return {
            user: this.user,
            accessToken: this.accessToken,
            refreshToken: this.refreshToken,
        };
    }

    fromJSON(session: AuthSession) {
        runInAction(() => {
            this.user = session.user;
            this.accessToken = session.accessToken;
            this.refreshToken = session.refreshToken;
        });
    }

    saveLocalSession() {
        const serialized = JSON.stringify(this.toJSON());
        window.localStorage.setItem(AUTH_STORAGE_KEY, serialized);
    }

    loadLocalSession() {
        const session = window.localStorage.getItem(AUTH_STORAGE_KEY);
        if (!session) return;

        try {
            this.fromJSON(JSON.parse(session) as AuthSession);
        } catch {
            window.localStorage.removeItem(AUTH_STORAGE_KEY);
        }
    }

    private parseUserFromQuery(rawUser: string): User | null {
        try {
            return JSON.parse(rawUser) as User;
        } catch {
            try {
                return JSON.parse(decodeURIComponent(rawUser)) as User;
            } catch {
                try {
                    return JSON.parse(atob(rawUser)) as User;
                } catch {
                    this.setError("Cannot parse user payload from OAuth callback");
                    return null;
                }
            }
        }
    }

    private buildApiUrl(path: string): string {
        const base = DEFAULT_API_BASE_URL.replace(/\/+$/, "");
        const normalizedPath = path.startsWith("/") ? path : `/${path}`;
        return `${base}${normalizedPath}`;
    }

    private clearAuthParamsFromUrl(callbackUrl: URL) {
        const paramsToDelete = [
            "access_token",
            "accessToken",
            "refresh_token",
            "refreshToken",
            "token",
            "user",
            "error",
            "error_description",
            "code",
            "state",
        ];
        paramsToDelete.forEach((key) => callbackUrl.searchParams.delete(key));
        callbackUrl.hash = "";
        window.history.replaceState({}, document.title, callbackUrl.toString());
    }

    openDrawer() {
        this.drawerOpened = true;
    }

    closeDrawer() {
        this.drawerOpened = false;
    }
}
