import ImageBlock from "../../entities/article/ui/ArticleContent/ImageBlock";
import IconBlock from "../../entities/article/ui/ArticleContent/IconBlock";

import { useArticleStore } from "../../entities/article/contexts/article.context";
import type { Block, Icon, Image, Paragraph } from "../../entities/article/types/content.types";
import { useIsMobileScreen } from "../../shared/lib/useIsMobile";
import ParagraphBlock from "../../entities/article/ui/ArticleContent/ParagraphBlock";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { type Layout } from "react-grid-layout";
import ResponsiveGridLayout from "../../shared/ui/grids/ResponsiveGridLayout";
import TopicHeader from "../../entities/article/ui/ArticleContent/TopicHeader";
import PageManager from "../../features/ArticleNavigation/ui/PageManager";


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

const ArticleContent: React.FC<{}> = observer(({ }) => {
    const article = useArticleStore()
    const isMobile = useIsMobileScreen();

    return (<>
        <ResponsiveGridLayout
            className="layout"
            cols={{ lg: 2, md: 2, sm: 2, xs: 2, xxs: 2 }}
            rowHeight={isMobile ? 80 : 180}
            compactType={null}
            containerPadding={{ lg: [0, 0], md: [0, 0], sm: [0, 0], xs: [0, 0] }}
            maxRows={4}
            margin={{ lg: [36, 18], md: [36, 18], sm: [16, 16], xs: [16, 16], xxs: [16, 16] }}
        >
            <div key='topic-header' data-grid={{ x: 0, y: 0, w: 2, h: 1, static: true }}>
                <TopicHeader />
            </div>

            {
                article.content.currentPage?.blocks.map((block, i) =>
                    <div key={`${i}`}
                        data-grid={{
                            x: block.layout.x,
                            y: block.layout.y + block.layout.y * (isMobile ? 1 : 0) - 1 * (isMobile ? 1 : 0),
                            w: block.layout.w,
                            h: block.layout.h + block.layout.h * (isMobile ? 1 : 0),
                            maxW: 2,
                            minW: 1,
                            maxH: 4,
                            minH: 1,
                            static: true
                        } as Layout}
                        style={{ height: 'fit-content' }}>
                        <ArticleBlock block={block} />
                    </div>
                )
            }
        </ResponsiveGridLayout>

    </>)
});

export default ArticleContent;