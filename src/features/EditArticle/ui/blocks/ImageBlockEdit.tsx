import { Loader, Stack, Text, Textarea } from "@mantine/core";
import { observer } from "mobx-react";
import { useEffect, useMemo, useState } from "react";
import { useArticleStore } from "../../../../entities/article/contexts/article.context";
import type { Image } from "../../../../entities/article/types/content.types";
import { uploadFileToS3 } from "../../../../shared/api";
import HighlitedBlock from "../../../../shared/ui/blocks/HighlitedBlock";
import ImageInput from "../../../../shared/ui/inputs/ImageInput/ui";
import MultiPopoverWithDrawer from "../../../../shared/ui/popover/MultiPopoverWithDrawer";

const PREPARE_UPLOAD_PATH = (import.meta.env.VITE_S3_IMAGE_PREPARE_PATH as string | undefined) ?? "/uploads/images/upload-url";
const CONFIRM_UPLOAD_PATH = (import.meta.env.VITE_S3_IMAGE_CONFIRM_PATH as string | undefined) ?? "/uploads/images/confirm";
const S3_PUBLIC_BASE_URL = (import.meta.env.VITE_S3_PUBLIC_BASE_URL as string | undefined) ?? "";

type PrepareUploadResponse = {
  key?: string;
  uploadUrl?: string;
  expiresIn?: number;
  data?: {
    key?: string;
    uploadUrl?: string;
    expiresIn?: number;
  };
};

type ConfirmUploadResponse = {
  url?: string;
  imageUrl?: string;
  data?: {
    url?: string;
    imageUrl?: string;
    avatarUrl?: string;
  };
};

function normalizeKey(raw: string): string {
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

function extractObjectKey(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return normalizeKey(trimmed);
  }

  try {
    const parsed = new URL(trimmed);
    const path = parsed.pathname.replace(/^\/+/, "");
    if (!path) return "";

    // path-style URL: s3.cloud.ru/<bucket>/<key>
    const pathSegments = path.split("/");
    if (parsed.hostname === "s3.cloud.ru" && pathSegments.length > 1) {
      return normalizeKey(pathSegments.slice(1).join("/"));
    }

    // virtual-hosted URL: <bucket>.s3.cloud.ru/<key>
    return normalizeKey(path);
  } catch {
    return normalizeKey(trimmed);
  }
}

function buildUrlFromPublicBase(keyOrUrl: string): string | null {
  const key = extractObjectKey(keyOrUrl);
  if (!key) return null;
  if (!S3_PUBLIC_BASE_URL) return key;

  const base = S3_PUBLIC_BASE_URL.endsWith("/") ? S3_PUBLIC_BASE_URL.slice(0, -1) : S3_PUBLIC_BASE_URL;
  const encodedKey = key
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");

  return `${base}/${encodedKey}`;
}

function resolveImageUrl(key: string, confirmResponse?: ConfirmUploadResponse): string | null {
  // Prefer key + VITE_S3_PUBLIC_BASE_URL. confirm url can be API endpoint format.
  const byKey = buildUrlFromPublicBase(key);
  if (byKey) return byKey;

  const direct = confirmResponse?.url
    ?? confirmResponse?.imageUrl
    ?? confirmResponse?.data?.url
    ?? confirmResponse?.data?.imageUrl
    ?? confirmResponse?.data?.avatarUrl;

  if (!direct) return null;
  return buildUrlFromPublicBase(direct) ?? direct;
}

const ImageBlockEdit: React.FC<{
  block: Image;
}> = observer((props) => {
  const [block, setBlock] = useState(props.block);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const article = useArticleStore();

  useEffect(() => {
    setBlock(props.block);
  }, [props.block]);

  const blockSuggestions = useMemo(
    () => article.aiSuggestions.filter((suggestion) => suggestion.blockId === props.block.id),
    [article.aiSuggestions, props.block.id],
  );

  const handleImageLoad = async (previewUrl: string, file: File) => {
    setUploadError(null);
    setUploading(true);

    setBlock((prev) => ({ ...prev, url: previewUrl }));

    try {
      const uploadResult = await uploadFileToS3<PrepareUploadResponse, ConfirmUploadResponse>({
        file,
        fileName: file.name,
        contentType: file.type,
        prepare: {
          path: PREPARE_UPLOAD_PATH,
          method: "POST",
          credentials: "include",
          body: ({ fileName, contentType } : { fileName: string; contentType: string }) => ({
            filename: fileName,
            contentType,
          }),
        },
        confirm: {
          path: CONFIRM_UPLOAD_PATH,
          method: "POST",
          credentials: "include",
          body: ({ key } : { key: string }) => ({ key }),
        },
      });

      const uploadedUrl = resolveImageUrl(uploadResult.key, uploadResult.confirmResponse);
      if (uploadedUrl) {
        setBlock((prev) => ({ ...prev, url: uploadedUrl }));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Ошибка";
      setUploadError(message);
    } finally {
      setUploading(false);
    }
  };

  const handleImageClear = () => {
    setUploadError(null);
    setBlock((prev) => ({ ...prev, url: "", source: null, sourceUrl: null, label: prev.label ?? null }));
  };

  useEffect(() => {
    if (!article.content) return;
    article.content.editBlock(block as any);
  }, [block, article.content]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <HighlitedBlock p={0} w="100%" h="100%" glow {...article.mainCategory.colors}>
        <ImageInput
          valueUrl={buildUrlFromPublicBase(block.url) ?? block.url}
          onImageClear={handleImageClear}
          onImageLoad={handleImageLoad}
          dropzoneProps={{
            w: "100%",
            h: "100%",
            c: article.mainCategory.colors.accentColor,
            radius: "5px",
            disabled: uploading,
          }}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            boxSizing: "border-box",
            padding: "8px",
          }}
        />

        {uploading ? (
          <Stack
            pos="absolute"
            top={0}
            left={0}
            w="100%"
            h="100%"
            justify="center"
            align="center"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.45)" }}
          >
            <Loader size="sm" color={article.mainCategory.colors.lightColor} />
          </Stack>
        ) : null}

        {uploadError ? (
          <Text
            pos="absolute"
            top={8}
            right={8}
            size="xs"
            c="#ffdddd"
            style={{
              background: "rgba(120, 0, 0, 0.75)",
              borderRadius: "4px",
              padding: "4px 8px",
              maxWidth: "70%",
            }}
          >
            {uploadError}
          </Text>
        ) : null}

        <Stack
          pos="absolute"
          hidden={!block.url}
          bottom={0}
          left={0}
          gap={0}
          w="100%"
          h="fit-content"
          style={{
            background: `linear-gradient(180deg, ${article.mainCategory.colors.darkColor + "00"} 0%, ${article.mainCategory.colors.darkColor + "80"} 20%, ${article.mainCategory.colors.darkColor} 100%)`,
          }}
          p={10}
          justify="end"
        >
          <Textarea
            value={block.label ?? ""}
            fw={400}
            h="fit-content"
            maxRows={3}
            maxLength={64}
            autosize
            w="100%"
            lh={1}
            classNames={{
              input: "placeholder-[#ffffff80]!",
            }}
            styles={{
              input: {
                fontSize: "12px",
                lineHeight: "1",
                color: article.mainCategory.colors.lightColor,
              },
            }}
            variant="unstyled"
            onMouseDown={(event) => {
              event.stopPropagation();
              event.preventDefault();
            }}
            onChange={(event) => setBlock({ ...block, label: event.currentTarget.value })}
            placeholder="Подпись"
          />
        </Stack>
      </HighlitedBlock>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 10,
          transform: "translateY(-50%)",
          zIndex: 30,
        }}
      >
        <MultiPopoverWithDrawer suggestions={blockSuggestions} hidden={article.swiping} />
      </div>
    </div>
  );
});

export default ImageBlockEdit;
