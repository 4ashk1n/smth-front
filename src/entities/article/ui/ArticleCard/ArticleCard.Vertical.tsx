import { Group, Stack, Text, Title } from "@mantine/core"
import type { ArticleMeta } from "@smth/shared"
import { PiEye } from "react-icons/pi"
import { formatNumber } from "../../../../shared/lib/formatNumber"
import { useCategoriesStore } from "../../../category/contexts/categories.context"
import ArticleBackground from "../ArticleContent/ArticleBackground"

const VerticalArticleCard: React.FC<{
    article: ArticleMeta
}> = ({ article }) => {
    const mainCategory = useCategoriesStore().getById(article.mainCategoryId)

    return (
        <Stack h='100%' w='100%' pos='relative' justify="space-between">
            <ArticleBackground mainCategory={mainCategory} />
            <Stack w='100%' gap={'4px'} style={{ zIndex: 1 }} p={8}>
                <Title fz={20} order={3} c='white'>
                    {article.title}
                </Title>
                <Text fz={14} fw={700} lh={'18px'} c={mainCategory?.colors.accentColor}>
                    #{mainCategory?.name}
                </Text>
            </Stack>

            <Group
                px={8}
                py={4}
                align="center"
                gap={4}
                style={{
                    zIndex: 1
                }}
            
            >
                <PiEye size={16} />
                <Text c='white' lh={1} fz={12}>
                    {formatNumber(999999)}
                </Text>
            </Group>

        </Stack>
    )
}

export default VerticalArticleCard