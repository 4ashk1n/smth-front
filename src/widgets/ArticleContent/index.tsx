import ImageBlock from "../../entities/article/ui/ArticleContent/ImageBlock";
import IconBlock from "../../entities/article/ui/ArticleContent/IconBlock";

import { useArticleStore } from "../../entities/article/contexts/article.context";
import type { Block, Icon, Image, Page, Paragraph } from "../../entities/article/types/content.types";
import { useIsMobileScreen } from "../../shared/lib/useIsMobile";
import ParagraphBlock from "../../entities/article/ui/ArticleContent/ParagraphBlock";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { type Layout } from "react-grid-layout";
import ResponsiveGridLayout from "../../shared/ui/grids/ResponsiveGridLayout";
import TopicHeader from "../../entities/article/ui/ArticleContent/TopicHeader";
import PageManager from "../../features/ArticleNavigation/ui/PageManager";
import ArticleCover from "../../entities/article/ui/ArticleContent/ArticleCover";
import EditTopicHeader from "../../features/EditArticle/ui/content/EditTopicHeader";
import ParagraphBlockEdit from "../../features/EditArticle/ui/blocks/ParagraphBlockEdit";
import ImageBlockEdit from "../../features/EditArticle/ui/blocks/ImageBlockEdit";
import IconBlockEdit from "../../features/EditArticle/ui/blocks/IconBlockEdit";
import { useLongPress } from "@mantine/hooks";
import { motion } from "framer-motion";


export const ArticleBlock = ({ block }: { block: Block }) => {
    return (<>
        {
            block.type === 'paragraph' ?
                <ParagraphBlock block={block as Paragraph} /> :
                block.type === 'image' ?
                    <ImageBlock block={block as Image} /> :
                    block.type === 'icon' ?
                        <IconBlock block={block as Icon} /> :
                        <></>
        }
    </>)
}

const ArticleEditBlock = ({ block }: { block: Block }) => {
    const article = useArticleStore();

    return (
        <motion.div
            animate={article.content.dragMode ? {
                x: [0, -1, 1, -1, 1, -1, 1, -1, 0],
                rotate: [0, -2, 2, -2, 2, -2, 2, -2, 0],
                transition: {
                    duration: 0.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }
            } : {
                x: 0,
                rotate: 0
            }}
            style={{
                height: '100%',
                width: '100%',
                pointerEvents: 'auto' // Важно для работы drag&drop
            }}
        >
            {
                block.type === 'paragraph' ?
                    <ParagraphBlockEdit block={block as Paragraph} /> :
                    block.type === 'image' ?
                        <ImageBlockEdit block={block as Image} /> :
                        block.type === 'icon' ?
                            <IconBlockEdit block={block as Icon} /> :
                            <></>
            }
        </motion.div>
    );
}

const ArticleContent: React.FC<{ page?: Page }> = observer(({ page }) => {
    const article = useArticleStore();
    const isMobile = useIsMobileScreen();

    const pageToRender = page ?? article.content.currentPage;
    if (!pageToRender) return null;

    const blocks = pageToRender.blocks;
    const topic =
        article.content.topics.get(pageToRender.topicId) ??
        article.content.currentTopic;



    if (page?.id === 'cover') return <ArticleCover />


    return (<>
        <ResponsiveGridLayout
            className="layout"
            key={'RGL-' + article.id}
            cols={{ lg: 2, md: 2, sm: 2, xs: 2, xxs: 2 }}
            rowHeight={80}
            compactType={null}
            containerPadding={{ lg: [0, 0], md: [0, 0], sm: [0, 0], xs: [0, 0] }}
            maxRows={8}
            margin={{ lg: [36, 18], md: [36, 18], sm: [16, 16], xs: [16, 16], xxs: [16, 16] }}
            onLayoutChange={(currentLayout, _) => { article.content.changeLayout(currentLayout) }}
        >
            <div key='topic-header' data-grid={{ x: 0, y: 0, w: 2, h: 1, static: true }}>
                {
                    article.editMode ? <EditTopicHeader topic={topic} /> : <TopicHeader topic={topic} />
                }
            </div>

            {
                blocks.map((block, i) =>
                    <div key={`${block.layout.i}`}
                        data-grid={{
                            x: block.layout.x,
                            y: block.layout.y  ,
                            w: block.layout.w,
                            h: block.layout.h,
                            maxW: 2,
                            minW: 1,
                            maxH: 7,
                            minH: 2,
                            static: !article.content.dragMode
                        } as Layout}
                        style={{ height: 'fit-content' }}

                    >

                        {
                            article.editMode ?
                                <ArticleEditBlock block={block} /> :
                                <ArticleBlock block={block} />
                        }

                    </div>
                )
            }
        </ResponsiveGridLayout>

    </>)
});

export default ArticleContent;