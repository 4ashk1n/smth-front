import { useEffect, useState } from "react"
import { useParams } from "react-router"
import ArticleStoreProvider from "../../../entities/article/contexts/article.context"
import { ArticleModel } from "../../../entities/article/models/article.model"
import { useCategoriesStore } from "../../../entities/category/contexts/categories.context"
import { getArticleById } from "../../../features/EditArticle/api/getArticleById"
import ArticleScreen from "./screen"

const ArticlePage = () => {
    const { id } = useParams()
    const categories = useCategoriesStore()
    const [article, setArticle] = useState<ArticleModel | null>(null)

    useEffect(() => {
        if (!id) return

        let cancelled = false
        const articleModel = new ArticleModel(categories)

        getArticleById(id)
            .then((articleDTO) => {
                if (cancelled) return
                articleModel.fromDTO(articleDTO)
                setArticle(articleModel)
            })
            .catch((error) => {
                console.error("Failed to load article", error)
                if (cancelled) return
                setArticle(null)
            })

        return () => {
            cancelled = true
        }
    }, [id, categories])

    if (!article) return null

    return (
        <ArticleStoreProvider article={article}>
            <ArticleScreen />
        </ArticleStoreProvider>
    )
}

export default ArticlePage
