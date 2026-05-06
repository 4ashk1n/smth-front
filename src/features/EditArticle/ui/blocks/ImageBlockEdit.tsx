import { Loader, Stack, Text, Textarea } from "@mantine/core";
import { observer } from "mobx-react";
import { useEffect, useMemo, useState } from "react";
import { useArticleStore } from "../../../../entities/article/contexts/article.context";
import type { Image } from "../../../../entities/article/types/content.types";
import { buildPublicS3Url, resolveUploadedS3Url, type S3ConfirmPayloadLike, uploadFileToS3 } from "../../../../shared/api";
import HighlitedBlock from "../../../../shared/ui/blocks/HighlitedBlock";
import ImageInput from "../../../../shared/ui/inputs/ImageInput/ui";
import MultiPopoverWithDrawer from "../../../../shared/ui/popover/MultiPopoverWithDrawer";

const PREPARE_UPLOAD_PATH = (import.meta.env.VITE_S3_IMAGE_PREPARE_PATH as string | undefined) ?? "/uploads/images/upload-url";
const CONFIRM_UPLOAD_PATH = (import.meta.env.VITE_S3_IMAGE_CONFIRM_PATH as string | undefined) ?? "/uploads/images/confirm";

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

type ConfirmUploadResponse = S3ConfirmPayloadLike;

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

      const uploadedUrl = resolveUploadedS3Url(uploadResult.key, uploadResult.confirmResponse);
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
          valueUrl={buildPublicS3Url(block.url) ?? block.url}
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
