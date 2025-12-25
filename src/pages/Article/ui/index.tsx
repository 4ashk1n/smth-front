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
import PageSwipeContainer from "../../../features/ArticleNavigation/ui/PageSwipeContainer"
import SlidingArticleContent from "../../../features/ArticleNavigation/ui/SlidingArticleContent"
import ArticleContentWithPreload from "../../../features/ArticleNavigation/ui/ArticleContentWithPreload"
import ArticleScreen from "./screen"

const ArticlePage = () => {
    const isMobile = useIsMobileScreen()

    return (
        <>
            <ArticleStoreProvider article={ARTICLE_DTO_SAMPLE}>
                <ArticleScreen />
            </ArticleStoreProvider>

        </>)
}

export default ArticlePage