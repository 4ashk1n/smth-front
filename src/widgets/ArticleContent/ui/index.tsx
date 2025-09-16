import { Grid, Stack } from "@mantine/core";
import type { ArticleFull } from "../../../entities/article/types/ArticleFull";
import ParagraphBlock from "./ParagraphBlock";
import type { Paragraph } from "../../../entities/article/types/blocks/Paragraph";
import type { Category } from "../../../entities/category/types/Category";
import ImageBlock from "./ImageBlock";
import type { Image } from "../../../entities/article/types/blocks/Image";
import IconBlock from "./IconBlock";
import type { Icon } from "../../../entities/article/types/blocks/Icon";
import type { BlockTypes } from "../../../entities/article/types/Content";
import type { CategoryColors } from "../../../entities/category/types/CategoryColors";
import ColBlock from "./ColBlock";
import { useMediaQuery } from "@mantine/hooks";
import { useIsMobileScreen } from "../../../shared/lib/useIsMobile";
import EmptyBlock from "./EmptyBlock";
import GridLayout from "react-grid-layout";
import { useContext } from "react";
import { ArticleContext } from "../../../features/stores/ArticleStore";

export const ArticleBlock = ({ block, mainCategory }: { block: BlockTypes, mainCategory: CategoryColors, editMode?: boolean }) => {
    return (<>
        {
            block.type === 'paragraph' ?
                <ParagraphBlock block={block as Paragraph} mainCategory={mainCategory as Category} /> :
                block.type === 'image' ?
                    <ImageBlock block={block as Image} mainCategory={mainCategory as Category} /> :
                    block.type === 'icon' ?
                        <IconBlock block={block as Icon} mainCategory={mainCategory as Category} /> :
                        block.type === 'col' ?
                            <ColBlock block={block as any} mainCategory={mainCategory as Category} /> :
                            block.type === 'empty' ?
                                <EmptyBlock block={block as any} /> :
                                <></>
        }
    </>)
}

const ArticleContent: React.FC<{}> = ({}) => {
    const { article } = useContext(ArticleContext);
    const isMobile = useIsMobileScreen();
    console.log(article.content.map((block, i) => ({x: block.layout.x, y: block.layout.y, w: block.layout.w, h: block.layout.h, i: i, static: true})))
    return (<>
        {/* <Grid justify="center" align="center" columns={isMobile ? 1 :12} gutter={80} mt={80}>
            {article.content.rows.map((row, i) =>
                row.map((block, j) =>
                    <Grid.Col span={isMobile ? 1 : block.span} key={j}>
                            <ArticleBlock block={block} editMode={editMode} mainCategory={article.mainCategory} />
                    </Grid.Col>
                )
            )}
        </Grid> */}

        <GridLayout
            className="layout"
            cols={12}
            rowHeight={250}
            width={1200}
            layout={article.content.map((block, i) => ({x: block.layout.x, y: block.layout.y, w: block.layout.w, h: block.layout.h, i: `${i}`, static: true}))}
        >
            {article.content.map((block, i) => 
            <div key={`${i}`} style={{height: 'fit-content'}}><ArticleBlock block={block} mainCategory={article.mainCategory} /></div>

            )}
        </GridLayout>
    </>)
};

export default ArticleContent;