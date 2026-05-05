import { Stack } from "@mantine/core"
import { observer } from "mobx-react"
import { useArticleStore } from "../../../entities/article/contexts/article.context"
import ArticleBackground from "../../../entities/article/ui/ArticleContent/ArticleBackground"
import ArticleHeader from "../../../entities/article/ui/ArticleHeader"
import PageSwipeContainer from "../../../features/ArticleNavigation/ui/PageSwipeContainer"
import SlidingArticleContent from "../../../features/ArticleNavigation/ui/SlidingArticleContent"
import { useIsMobileScreen } from "../../../shared/lib/useIsMobile"
import ResponsiveGridLayout from "../../../shared/ui/grids/ResponsiveGridLayout"
import ArticleContent from "../../../widgets/ArticleContent"
import ArticleOverlay from "../../../widgets/ArticleOverlay/ui"

const ArticleScreen = observer(() => {

    const article = useArticleStore()
    const isMobile = useIsMobileScreen()

    return (<>
    
        <ArticleBackground />
        {/* <ParallaxProvider> */}
        <Stack
            align="center"
            w="100%"
            h="100%"
            style={{ overflow: "hidden" }}
            key={'article-' + article.id}
        >
            {isMobile ? (
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        zIndex: 1,
                        overflow: "hidden",
                    }}
                >
                    <PageSwipeContainer overlay={<ArticleOverlay />}>
                        {(swipeX) => <SlidingArticleContent swipeX={swipeX} />}
                    </PageSwipeContainer>

                </div>
            )
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
                            {/* <TopicsList /> */}
                        </div>
                    </ResponsiveGridLayout>
                </div>
            }

        </Stack>
        {/* </ParallaxProvider> */}
    </>)
})

export default ArticleScreen