import { Stack } from "@mantine/core"
import PageManager from "../../../features/ArticleNavigation/ui/PageManager"
import ArticleHeader from "../../../entities/article/ui/ArticleHeader"
import ActionButtons from "../../../features/ArticleReaderActions/ui/ActionButtons"

const ArticleOverlay = () => {
    return (
        <Stack
            gap={12}
            py={12}
            align="center"
            style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                background: 'linear-gradient(0deg, #00000080, #00000000 100%)',
            }}
        >
            <PageManager />
            <ArticleHeader />
            <ActionButtons />
        </Stack>
    )
}

export default ArticleOverlay