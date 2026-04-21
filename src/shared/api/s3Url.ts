const S3_PUBLIC_BASE_URL = (import.meta.env.VITE_S3_PUBLIC_BASE_URL as string | undefined) ?? "";

export type S3ConfirmPayloadLike = {
    url?: string;
    imageUrl?: string;
    data?: {
        url?: string;
        imageUrl?: string;
        avatarUrl?: string;
    };
};

export function normalizeS3ObjectKey(raw: string): string {
    return raw
        .split("/")
        .map((part) => {
            try {
                return decodeURIComponent(part);
            } catch {
                return part;
            }
        })
        .join("/")
        .replace(/^\/+/, "");
}

export function extractS3ObjectKey(value: string): string {
    const trimmed = value.trim();
    if (!trimmed) return "";

    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
        return normalizeS3ObjectKey(trimmed);
    }

    try {
        const parsed = new URL(trimmed);
        const path = parsed.pathname.replace(/^\/+/, "");
        if (!path) return "";

        const pathSegments = path.split("/");
        if (parsed.hostname === "s3.cloud.ru" && pathSegments.length > 1) {
            return normalizeS3ObjectKey(pathSegments.slice(1).join("/"));
        }

        return normalizeS3ObjectKey(path);
    } catch {
        return normalizeS3ObjectKey(trimmed);
    }
}

export function buildPublicS3Url(keyOrUrl: string): string | null {
    const key = extractS3ObjectKey(keyOrUrl);
    if (!key) return null;
    if (!S3_PUBLIC_BASE_URL) return key;

    const base = S3_PUBLIC_BASE_URL.endsWith("/") ? S3_PUBLIC_BASE_URL.slice(0, -1) : S3_PUBLIC_BASE_URL;
    const encodedKey = key
        .split("/")
        .map((part) => encodeURIComponent(part))
        .join("/");

    return `${base}/${encodedKey}`;
}

export function resolveUploadedS3Url(key: string, confirmResponse?: S3ConfirmPayloadLike): string | null {
    const byKey = buildPublicS3Url(key);
    if (byKey) return byKey;

    const direct = confirmResponse?.url
        ?? confirmResponse?.imageUrl
        ?? confirmResponse?.data?.url
        ?? confirmResponse?.data?.imageUrl
        ?? confirmResponse?.data?.avatarUrl;

    if (!direct) return null;
    return buildPublicS3Url(direct) ?? direct;
}
