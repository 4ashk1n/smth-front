import { Stack, Grid } from "@mantine/core"
import ArticleStoreProvider from "../../../entities/article/contexts/article.context"
import { ARTICLE_DTO_SAMPLE } from "../../../entities/article/samples/article.sample"
import ArticleContent from "../../../widgets/ArticleContent"
import ArticleBackground from "../../../entities/article/ui/ArticleContent/ArticleBackground"
import ArticleHeader from "../../../entities/article/ui/ArticleHeader"
import ReactGridLayout from "react-grid-layout"
import ResponsiveGridLayout from "../../../shared/ui/grids/ResponsiveGridLayout"
import TopicsList from "../../../features/ArticleNavigation/ui/TopicManager"
import { useIsMobileScreen } from "../../../shared/lib/useIsMobile"
import ArticleOverlay from "../../../widgets/ArticleOverlay/ui"

const ArticlePage = () => {
    const isMobile = useIsMobileScreen()
    return (<>
        <ArticleStoreProvider article={ARTICLE_DTO_SAMPLE}>
            <ArticleBackground />
            <Stack align="center" w='100%' h='100%'>
                {
                    isMobile ?
                        <Stack
                            h='100%'
                            gap={24}
                            style={{
                                position: 'relative',
                                width: '100%',
                                height: '100%',
                                zIndex: 1,
                            }}
                        >
                            <ArticleContent />
                            <ArticleOverlay />
                        </Stack>
                        :
                        <div
                            style={{
                                position: 'relative',
                                width: '90%',
                                height: '100%',
                                zIndex: 1,
                                maxWidth: 1280
                            }}
                        >
                            <ResponsiveGridLayout
                                cols={{ lg: 4, md: 4, sm: 2, xs: 1, xxs: 1 }}
                                rowHeight={180}
                                className="layout"
                                margin={{ lg: [36, 18], md: [36, 18], sm: [36, 18], xs: [36, 18] }}
                            >
                                <div key='header' data-grid={{ x: 0, y: 0, w: 1, h: 4, static: true }}>
                                    <ArticleHeader />
                                </div>

                                <div key='content' className="h-full" data-grid={{ x: 1, y: 0, w: 2, h: 4, static: true }}>
                                    <ArticleContent />
                                </div>

                                <div key="topics-list" data-grid={{ x: 4, y: 0, w: 1, h: 1, static: true }}>
                                    <TopicsList />
                                </div>
                            </ResponsiveGridLayout>
                        </div>
                }

            </Stack>
        </ArticleStoreProvider>

    </>)
}

export default ArticlePage