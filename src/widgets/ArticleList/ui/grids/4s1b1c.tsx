import { Grid } from "@mantine/core"
import ArticleCardLarge from "../../../ArticleCard/ui/ArticleCard.Large"
import type { GetArticleCardDTO } from "smth-shared/src/dto/article.dto"
import ArticleCardCompact from "../../../ArticleCard/ui/ArticleCard.Compact"
import type { Category } from "../../../../entities/category/types/Category"
import CategoryCard from "../../../CategoryCard/ui"

const Grid_4s1b1c: React.FC<{ articles: GetArticleCardDTO[], category: Category }> = ({ articles, category }) => {
    if (articles.length < 5) return null
    return (
        <Grid columns={4}>

            <Grid.Col span={2}>
                <ArticleCardLarge {...articles[0]} />
            </Grid.Col>

            <Grid.Col span={2}>

                <Grid columns={2}>
                    <Grid.Col span={2}>
                        <CategoryCard category={category} />
                    </Grid.Col>
                    <Grid.Col span={1}>
                        <ArticleCardCompact {...articles[1]} />
                    </Grid.Col>
                    <Grid.Col span={1}>
                        <ArticleCardCompact {...articles[2]} />
                    </Grid.Col>
                    <Grid.Col span={1}>
                        <ArticleCardCompact {...articles[1]} />
                    </Grid.Col>
                    <Grid.Col span={1}>
                        <ArticleCardCompact {...articles[2]} />
                    </Grid.Col>
                </Grid>
            </Grid.Col>
        </Grid>
    )
}

export default Grid_4s1b1c;