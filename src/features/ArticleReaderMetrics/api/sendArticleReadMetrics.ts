import type { UpdateArticleReadMetrics, UpdateArticleReadMetricsResponse } from "@smth/shared";
import { apiRequest } from "../../../shared/api";

const DEFAULT_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "";

type SendReadMetricsOptions = {
    keepalive?: boolean;
};

function buildUrl(path: string): string {
    const trimmedBase = DEFAULT_BASE_URL.endsWith("/") ? DEFAULT_BASE_URL.slice(0, -1) : DEFAULT_BASE_URL;
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return new URL(`${trimmedBase}${normalizedPath}`, window.location.origin).toString();
}

export async function sendArticleReadMetrics(
    articleId: string,
    payload: UpdateArticleReadMetrics,
    options: SendReadMetricsOptions = {},
): Promise<void> {
    const path = `/articles/${articleId}/metrics/read`;

    if (options.keepalive) {
        const body = JSON.stringify(payload);
        const url = buildUrl(path);

        if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
            const sent = navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
            if (sent) return;
        }

        await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            keepalive: true,
            body,
        });
        return;
    }

    await apiRequest<UpdateArticleReadMetricsResponse>(path, {
        method: "POST",
        credentials: "include",
        body: payload,
    });
}
