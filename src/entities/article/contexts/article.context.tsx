import { observer } from "mobx-react"
import { createContext, useContext, useEffect, useState } from "react"
import { useCategoriesStore } from "../../category/contexts/categories.context"
import { useAuthStore } from "../../user/contexts/auth.context"
import { useUsersStore } from "../../user/contexts/users.context"
import { ArticleModel } from "../models/article.model"
import { ArticlesStore } from "../stores/articles.store"
import type { ArticleDTO } from "../types/article.types"

const ArticlesContext = createContext<ArticlesStore | null>(null)


export const useArticleStore = () => {
    const context = useContext(ArticlesContext)
    if (!context) {
        throw new Error('useArticleStore must be used within a ArticleProvider')
    }
    return context.activeArticle
}

export const useArticlesStore = () => {
    const context = useContext(ArticlesContext)
    if (!context) {
        throw new Error('useArticlesStore must be used within a ArticleProvider')
    }
    return context
}

const ArticleStoreProvider: React.FC<{
    children: React.ReactNode
    article?: ArticleDTO
    editMode?: boolean
    empty?: boolean
}> = observer(({ children, article, editMode, empty }) => {
    const categoriesStore = useCategoriesStore()
    const auth = useAuthStore()
    const users = useUsersStore()
    const [articlesStore] = useState(() => new ArticlesStore(categoriesStore))

    useEffect(() => {
        let currentArticle: ArticleModel | undefined

        if (article) {
            currentArticle = articlesStore.upsertFromDTO(article)
            articlesStore.setActiveArticle(currentArticle.id)
        }
        else if (empty) {
            currentArticle = articlesStore.createEmptyArticle()
            articlesStore.setActiveArticle(currentArticle.id)
        }
        else return;

        if (!currentArticle) return

        if (editMode) {
            currentArticle.loadLocalDraft()
        }
        currentArticle.setEditMode(editMode ?? false)
        currentArticle.content.changePage('cover')
    }, [article, empty, editMode, users, categoriesStore, articlesStore])

    useEffect(() => {
        const currentArticle = articlesStore.activeArticleOrUndefined
        if (!currentArticle) return
        if (!auth.user) return
        users.upsert(auth.user)
        if (editMode) {
            currentArticle.setAuthorId(auth.user.id)
        }
    }, [auth.user, editMode, users, articlesStore])

    return (
        <ArticlesContext.Provider value={articlesStore}>
            {children}
        </ArticlesContext.Provider>
    )
})

export default ArticleStoreProvider
