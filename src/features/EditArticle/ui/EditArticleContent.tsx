import { useContext, useRef } from "react";
import type { BlockTypes } from "../../../entities/article/types/Content";
import { Center } from "@mantine/core";
import { Responsive as ResponsiveGridLayout } from "react-grid-layout";
import { LuArrowDownRight } from "react-icons/lu";
import AddBlockAffix from "./AddBlockAffix";
import { EditArticleBlock } from "./EditArticleBlock";
import { ArticleContext } from "../../stores/ArticleStore";
import { observer } from "mobx-react-lite";
import IconSelectMenu from "../../../shared/icon/IconSelectMenu";


const EditArticleContent: React.FC<{}> = observer(() => {
    const { article, categoryColors, changeLayout } = useContext(ArticleContext)
    const GridRef = useRef<ResponsiveGridLayout>(null)

    return (<>
        <ResponsiveGridLayout
            compactType={null}
            ref={GridRef}
            onLayoutChange={changeLayout}
            width={1200}
            rowHeight={40}
            className="layout"
            resizeHandle={
                <Center
                    className="react-resizable-handle after:display-none after:content-['']"
                    style={{
                        position: 'absolute',
                        right: 0,
                        padding: 0,
                        bottom: 0,
                        width: '26px',
                        height: '26px',
                        cursor: 'se-resize',
                        zIndex: 20,
                        background: 'black',
                        borderRadius: '10px 0 10px 0',
                    }}
                >
                    <LuArrowDownRight color={categoryColors.accentColor} size={16} />
                </Center>
            }
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            layouts={{ lg: article.content.map((block) => (block.layout)) }}
            autoSize
        >
            {article.content.map((block) => (
                <div
                    key={block.layout.i}
                    style={{
                        cursor: 'grab',
                        position: 'relative',
                        zIndex: -1 * (block.object3d?.translateZ || 0) + 5,
                    }}
                >
                    <EditArticleBlock block={block}  />
                </div>
            ))}

        </ResponsiveGridLayout>

        <AddBlockAffix />
    </>)
})


export default EditArticleContent