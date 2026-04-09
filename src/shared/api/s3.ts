import type { ApiMethod } from "./apiClient";
import { apiRequest } from "./apiClient";
import {
    ConfirmImageUploadDataSchema,
    ConfirmImageUploadResponseSchema,
    PrepareImageUploadDataSchema,
    PrepareImageUploadResponseSchema,
    type ConfirmImageUploadData,
    type ConfirmImageUploadResponse,
    type PrepareImageUploadData,
    type PrepareImageUploadResponse,
} from "@smth/shared";

export type S3PresignedUpload = PrepareImageUploadData;
export type S3ConfirmedUpload = ConfirmImageUploadData;

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
type S3RequestBody = JsonValue | FormData | Blob | URLSearchParams;

type S3PrepareRawResponse =
    | PrepareImageUploadResponse
    | PrepareImageUploadData
    | { data: PrepareImageUploadData };

type S3ConfirmRawResponse =
    | ConfirmImageUploadResponse
    | ConfirmImageUploadData
    | { data: ConfirmImageUploadData };

export type S3UploadContext = {
    key: string;
    uploadUrl: string;
    file: File | Blob;
    fileName: string;
    contentType: string;
};

export type S3UploadPrepareOptions<TPrepareResponse = PrepareImageUploadResponse> = {
    path: string;
    method?: Extract<ApiMethod, "POST" | "PUT" | "PATCH">;
    body?: S3RequestBody | ((ctx: Pick<S3UploadContext, "file" | "fileName" | "contentType">) => S3RequestBody);
    credentials?: RequestCredentials;
    mapResponse?: (response: TPrepareResponse) => S3PresignedUpload;
};

export type S3UploadConfirmOptions<TConfirmResponse = ConfirmImageUploadResponse> = {
    path: string;
    method?: Extract<ApiMethod, "POST" | "PUT" | "PATCH">;
    body?: S3RequestBody | ((ctx: S3UploadContext) => S3RequestBody);
    credentials?: RequestCredentials;
    parseResponse?: (response: S3ConfirmRawResponse) => TConfirmResponse;
};

export type UploadFileToS3Options<
    TPrepareResponse = PrepareImageUploadResponse,
    TConfirmResponse = ConfirmImageUploadResponse,
> = {
    file: File | Blob;
    fileName?: string;
    contentType?: string;
    signal?: AbortSignal;
    uploadHeaders?: Record<string, string>;
    prepare: S3UploadPrepareOptions<TPrepareResponse>;
    confirm?: S3UploadConfirmOptions<TConfirmResponse>;
};

export type UploadFileToS3Result<TConfirmResponse = ConfirmImageUploadResponse> = {
    key: string;
    uploadUrl: string;
    confirmed: boolean;
    confirmResponse?: TConfirmResponse;
};

function defaultMapPrepareResponse(response: S3PrepareRawResponse): S3PresignedUpload {
    const fullResponseResult = PrepareImageUploadResponseSchema.safeParse(response);
    if (fullResponseResult.success) {
        return fullResponseResult.data.data;
    }

    const directPayloadResult = PrepareImageUploadDataSchema.safeParse(response);
    if (directPayloadResult.success) {
        return directPayloadResult.data;
    }

    const root = response as { data?: PrepareImageUploadData };
    const nestedPayloadResult = PrepareImageUploadDataSchema.safeParse(root.data);
    if (nestedPayloadResult.success) {
        return nestedPayloadResult.data;
    }

    throw new Error("S3 prepare response has invalid shape");
}

function defaultParseConfirmResponse(response: S3ConfirmRawResponse): ConfirmImageUploadResponse {
    const fullResponseResult = ConfirmImageUploadResponseSchema.safeParse(response);
    if (fullResponseResult.success) {
        return fullResponseResult.data;
    }

    const directPayloadResult = ConfirmImageUploadDataSchema.safeParse(response);
    if (directPayloadResult.success) {
        return {
            success: true,
            data: directPayloadResult.data,
        };
    }

    const root = response as { data?: ConfirmImageUploadData };
    const nestedPayloadResult = ConfirmImageUploadDataSchema.safeParse(root.data);
    if (nestedPayloadResult.success) {
        return {
            success: true,
            data: nestedPayloadResult.data,
        };
    }

    throw new Error("S3 confirm response has invalid shape");
}

async function putFileToPresignedUrl(
    uploadUrl: string,
    file: File | Blob,
    contentType: string,
    signal?: AbortSignal,
    headers: Record<string, string> = {},
): Promise<void> {
    const putHeaders: Record<string, string> = {
        "Content-Type": contentType,
        ...headers,
    };

    const response = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: putHeaders,
        signal,
    });

    if (!response.ok) {
        throw new Error(`S3 upload failed with status ${response.status}`);
    }
}

export async function uploadFileToS3<
    TPrepareResponse = PrepareImageUploadResponse,
    TConfirmResponse = ConfirmImageUploadResponse,
>(
    options: UploadFileToS3Options<TPrepareResponse, TConfirmResponse>,
): Promise<UploadFileToS3Result<TConfirmResponse>> {
    const {
        file,
        fileName = file instanceof File ? file.name : "file",
        contentType = file.type || "application/octet-stream",
        signal,
        uploadHeaders,
        prepare,
        confirm,
    } = options;

    const prepareBody = typeof prepare.body === "function"
        ? prepare.body({ file, fileName, contentType })
        : prepare.body;

    const prepareResponse = await apiRequest<TPrepareResponse>(prepare.path, {
        method: prepare.method ?? "POST",
        body: prepareBody,
        credentials: prepare.credentials,
        signal,
    });

    const mapResponse = prepare.mapResponse ?? ((value: TPrepareResponse) => defaultMapPrepareResponse(value as S3PrepareRawResponse));
    const { key, uploadUrl } = mapResponse(prepareResponse);

    await putFileToPresignedUrl(uploadUrl, file, contentType, signal, uploadHeaders);

    if (!confirm) {
        return {
            key,
            uploadUrl,
            confirmed: false,
        };
    }

    const ctx: S3UploadContext = {
        key,
        uploadUrl,
        file,
        fileName,
        contentType,
    };

    const confirmBody = typeof confirm.body === "function"
        ? confirm.body(ctx)
        : confirm.body;

    const rawConfirmResponse = await apiRequest<S3ConfirmRawResponse>(confirm.path, {
        method: confirm.method ?? "POST",
        body: confirmBody,
        credentials: confirm.credentials,
        signal,
    });

    const parsedConfirmResponse = confirm.parseResponse
        ? confirm.parseResponse(rawConfirmResponse)
        : (defaultParseConfirmResponse(rawConfirmResponse) as TConfirmResponse);

    return {
        key,
        uploadUrl,
        confirmed: true,
        confirmResponse: parsedConfirmResponse,
    };
}
