import { createContext, useContext, useEffect, useState } from "react"
import type { Article, ArticleDTO } from "../types/article.types"
import { ArticleStore } from "../stores/article.store"

const ArticleContext = createContext<ArticleStore | null>(null)

export const useArticleStore = () => {
    const context = useContext(ArticleContext)
    if (!context) {
        throw new Error('useArticleStore must be used within a ArticleProvider')
    }
    return context
}

const ArticleStoreProvider: React.FC<{
    children: React.ReactNode
    article: ArticleDTO
}> = ({ children, article }) => {
    
    const [store] = useState(() => new ArticleStore())

    useEffect(() => {
        store.fromDTO(article)
    }, [article])

    return (
        <ArticleContext.Provider value={store}>
            {children}
        </ArticleContext.Provider>
    )
}

export default ArticleStoreProvider