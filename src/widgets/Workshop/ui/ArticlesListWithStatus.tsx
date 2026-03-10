import { Grid, Group, Stack, Text, Title } from "@mantine/core"
import type { ArticleStatus } from "@smth/shared"
import type { ArticleMeta } from "../../../entities/article/types/article.types"
import ArticleCard from "../../../entities/article/ui/ArticleCard/ArticleCard"
import { formatNumber } from "../../../shared/lib/formatNumber"
import Grid3ColumnsVertical from "../../../shared/ui/grids/Grid3ColumnsVertical"

const ArticlesListWithStatus: React.FC<{
    status: ArticleStatus
    articles: ArticleMeta[]
    loading?: boolean
    onCardClick: (articleId: string) => void
}> = ({ status, articles, loading, onCardClick }) => {

    return (
        <Stack gap={4}>
            <Group gap={'8px'} px={16}>
                <Title order={2} fz={16}>
                    {
                        status === 'draft' ? 'Черновики' :
                            status === 'published' ? 'Опубликованные' :
                                status === 'review' ? 'На проверке' :
                                    status === 'archived' ? 'Архив' : ''
                    }
                </Title>
                <Text fz={16} fw={400}>
                    {formatNumber(articles.length)}
                </Text>
            </Group>

            <Grid3ColumnsVertical isLoading={loading}>
                {
                    articles.map((article, i) => (
                        <Grid.Col span={1} key={i} h={180} >
                            <ArticleCard variant="vertical" article={article} key={i} onClick={() => onCardClick(article.id)} />
                        </Grid.Col>
                    ))
                }
            </Grid3ColumnsVertical>
        </Stack>
    )
}

export default ArticlesListWithStatus