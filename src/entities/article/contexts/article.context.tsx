import { createContext, useContext, useEffect, useState } from "react"
import { ArticleStore } from "../stores/article.store"
import type { ArticleDTO } from "../types/article.types"

const ArticleContext = createContext<ArticleStore | null>(null)

/**
 * Hook that returns the ArticleStore instance.
 * It should be used within the ArticleProvider component.
 * @returns {ArticleStore} The ArticleStore instance.
 * @throws {Error} If useArticleStore is used outside of the ArticleProvider component.
 */
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
    editMode?: boolean
}> = ({ children, article, editMode }) => {
    
    const [store] = useState(() => new ArticleStore())

    useEffect(() => {
        store.fromDTO(article)
        if (editMode) store.loadLocalDraft()
        store.setEditMode(editMode ?? false)
        store.content.changePage('cover')
    }, [article])

    return (
        <ArticleContext.Provider value={store}>
            {children}
        </ArticleContext.Provider>
    )
}

export default ArticleStoreProvider