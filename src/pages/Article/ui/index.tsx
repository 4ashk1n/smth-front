import ArticleStoreProvider from "../../../entities/article/contexts/article.context"
import { ArticleModel } from "../../../entities/article/models/article.model"
import { ARTICLE_DTO_SAMPLE } from "../../../entities/article/samples/article.sample"
import { useCategoriesStore } from "../../../entities/category/contexts/categories.context"
import { useIsMobileScreen } from "../../../shared/lib/useIsMobile"
import ArticleScreen from "./screen"

const ArticlePage = () => {
    const isMobile = useIsMobileScreen()
    const categories = useCategoriesStore()

    const article = (new ArticleModel(categories))
    article.fromDTO(ARTICLE_DTO_SAMPLE)

    return (
        <>
            <ArticleStoreProvider article={article}>
                <ArticleScreen />
            </ArticleStoreProvider>

        </>)
}

export default ArticlePage