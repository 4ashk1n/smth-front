import { Group, Stack, Text, Title } from "@mantine/core"
import type { ArticleMeta, ArticleMetricsResponse } from "@smth/shared"
import { useEffect, useState } from "react"
import { PiEye } from "react-icons/pi"
import { apiRequest } from "../../../../shared/api"
import { formatNumber } from "../../../../shared/lib/formatNumber"
import { useCategoriesStore } from "../../../category/contexts/categories.context"
import ArticleBackground from "../ArticleContent/ArticleBackground"

const articleViewsCache = new Map<string, number>()

const VerticalArticleCardOverlay: React.FC<{
    article: ArticleMeta
}> = ({ article }) => {
    const [views, setViews] = useState<number | null>(() => articleViewsCache.get(article.id) ?? null)

    useEffect(() => {
        if (article.status !== "published") return

        const cachedViews = articleViewsCache.get(article.id)
        if (cachedViews !== undefined) {
            setViews(cachedViews)
            return
        }

        let cancelled = false

        apiRequest<ArticleMetricsResponse>(`/articles/${article.id}/metrics`, { credentials: "include" })
            .then((response) => {
                if (cancelled) return
                articleViewsCache.set(article.id, response.data.views)
                setViews(response.data.views)
            })
            .catch(() => {
                if (cancelled) return
                setViews(0)
            })

        return () => {
            cancelled = true
        }
    }, [article.id, article.status])

    return (
        <Group
            px={8}
            py={4}
            align="center"
            gap={4}
            style={{
                zIndex: 1
            }}
        >
            {
                article.status === 'published' ?
                    <>
                        <PiEye size={16} />
                        <Text c='white' lh={1} fz={12}>
                            {views === null ? "..." : formatNumber(views)}
                        </Text>
                    </>
                
                : article.status === 'draft' ?
                    <>
                        <Text c='white' lh={1} fz={12}>
                            Черновик
                        </Text>    
                    </>

                : article.status === 'archived' ?
                    <>
                        <Text c='white' lh={1} fz={12}>
                            Архив
                        </Text>    
                    </>

                : article.status === 'review' ?
                    <>
                        <Text c='white' lh={1} fz={12}>
                            На проверке
                        </Text>    
                    </>
                : null
            }

        </Group>
    )



}

const VerticalArticleCard: React.FC<{
    article: ArticleMeta
    onClick: () => void
}> = ({ article, onClick }) => {
    const mainCategory = useCategoriesStore().getById(article.mainCategoryId)

    return (
        <Stack h='100%' w='100%' pos='relative' justify="space-between" onClick={onClick}>
            <ArticleBackground mainCategory={mainCategory} />
            <Stack w='100%' gap={'4px'} style={{ zIndex: 1 }} p={8}>
                <Title fz={20} order={3} c='white'>
                    {article.title}
                </Title>
                <Text fz={14} fw={700} lh={'18px'} c={mainCategory?.colors.accentColor}>
                    #{mainCategory?.name}
                </Text>
            </Stack>

            <VerticalArticleCardOverlay article={article} />


        </Stack>
    )
}

export default VerticalArticleCard
