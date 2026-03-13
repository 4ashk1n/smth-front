import { Stack, Textarea } from "@mantine/core";
import { observer } from "mobx-react";
import { useEffect, useMemo, useState } from "react";
import { useArticleStore } from "../../../../entities/article/contexts/article.context";
import type { Image } from "../../../../entities/article/types/content.types";
import HighlitedBlock from "../../../../shared/ui/blocks/HighlitedBlock";
import ImageInput from "../../../../shared/ui/inputs/ImageInput/ui";
import MultiPopoverWithDrawer from "../../../../shared/ui/popover/MultiPopoverWithDrawer";

const ImageBlockEdit: React.FC<{
  block: Image;
}> = observer((props) => {
  const [block, setBlock] = useState(props.block);
  const article = useArticleStore();

  const blockSuggestions = useMemo(
    () => article.aiSuggestions.filter((suggestion) => suggestion.blockId === props.block.id),
    [article.aiSuggestions, props.block.id],
  );

  const handleImageLoad = (url: string) => {
    setBlock({ ...block, url });
  };

  const handleImageClear = () => {
    setBlock({ ...block, url: "" });
  };

  useEffect(() => {
    article.content.editBlock(block);
  }, [block, article.content]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <HighlitedBlock p={0} w="100%" h="100%" glow {...article.mainCategory.colors}>
        <ImageInput
          onImageClear={handleImageClear}
          onImageLoad={handleImageLoad}
          dropzoneProps={{
            w: "100%",
            h: "100%",
            c: article.mainCategory.colors.accentColor,
            radius: "5px",
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
            value={block.label}
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
            placeholder="Описание"
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
