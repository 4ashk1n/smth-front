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

export const ArticleBlock = ({ block, mainCategory }: { block: BlockTypes, mainCategory: CategoryColors }) => {
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
                            null
        }
    </>)
}

const ArticleContent: React.FC<{ article: ArticleFull }> = ({ article }) => {
    const isMobile = useIsMobileScreen();
    return (<>
        <Grid justify="center" align="center" columns={isMobile ? 1 :12} gutter={80} mt={80}>
            {article.content.rows.map((row, i) =>
                row.map((block, j) =>
                    <Grid.Col span={isMobile ? 1 : block.span} key={j}>
                        {/* <AnimationOnScroll animateIn="animate__fadeIn"  key={j}> */}

                            <ArticleBlock block={block} mainCategory={article.mainCategory} />

                        {/* </AnimationOnScroll> */}
                    </Grid.Col>
                )
            )}
        </Grid>
    </>)
};

export default ArticleContent;