import { Center, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { observer } from "mobx-react";
import { useEffect, useMemo, useState } from "react";
import { PiPlusBold } from "react-icons/pi";
import { useArticleStore } from "../../../../entities/article/contexts/article.context";
import type { Icon } from "../../../../entities/article/types/content.types";
import IconSelectMenu from "../../../../shared/icon/IconSelectMenu";
import ReactIcon, { type IconName } from "../../../../shared/icon/ReactIcon";
import MultiPopoverWithDrawer from "../../../../shared/ui/popover/MultiPopoverWithDrawer";

const IconBlockEdit: React.FC<{
  block: Icon;
}> = observer((props) => {
  const [block, setBlock] = useState(props.block);
  const article = useArticleStore();
  const [opened, { open, close }] = useDisclosure(false);

  const blockSuggestions = useMemo(
    () => article.aiSuggestions.filter((suggestion) => suggestion.blockId === props.block.id),
    [article.aiSuggestions, props.block.id],
  );

  const saveChanges = () => {
    if (props.block.name === block.name) return;
    if (!article.content) return null
    article.content.editBlock(block as any);
  };

  useEffect(() => {
    saveChanges();
  }, [block.name]);

  useEffect(() => {
    if (!article.content) return 
    if (opened && article.content.dragMode) article.content.setDragMode(false);
  }, [opened, article.content]);

  return (
    <>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            border: props.block.name ? "none" : "2px dashed " + article.mainCategory.colors.accentColor + "80",
            borderRadius: "10px",
          }}
          onClick={() => {
            if (!article.content?.dragMode) open();
          }}
        >
          <svg width="1px" height="1px" style={{ visibility: "hidden" }}>
            <linearGradient id="accent-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop stopColor={article.mainCategory.colors.lightColor} offset="0%" />
              <stop stopColor={article.mainCategory.colors.darkColor} offset="100%" />
            </linearGradient>
          </svg>

          {props.block.name ? (
            <ReactIcon
              style={{
                stroke: "url(#accent-gradient)",
                fill: "url(#accent-gradient)",
                overflow: "visible",
              }}
              size="100%"
              name={props.block.name as IconName}
            />
          ) : (
            <Center w="100%" h="100%" bg="#00000080" style={{ borderRadius: "10px" }}>
              <PiPlusBold size={48} color={article.mainCategory.colors.accentColor} />
            </Center>
          )}
        </div>
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

      <Drawer
        opened={opened}
        onClose={close}
        withCloseButton={false}
        size="sm"
        position="bottom"
        zIndex={1000}
        styles={{
          content: {
            backgroundColor: "#00000080",
            backdropFilter: "blur(10px)",
            height: "80vh",
            overflow: "hidden",
          },
          body: {
            height: "80vh",
            overflow: "hidden",
            padding: 12,
            paddingBottom: 16,
          },
          overlay: {
            backgroundColor: "#00000040",
          },
        }}
      >
        <IconSelectMenu
          color={article.mainCategory.colors.accentColor}
          setIcon={(name) => {
            setBlock({ ...block, name });
            close();
          }}
        />
      </Drawer>
    </>
  );
});

export default IconBlockEdit;
