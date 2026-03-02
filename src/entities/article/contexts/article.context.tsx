import { createContext, useContext, useEffect, useState } from "react"
import { observer } from "mobx-react"
import { ArticleStore } from "../stores/article.store"
import type { ArticleDTO } from "../types/article.types"
import { useCategoriesStore } from "../../category/contexts/categories.context"
import { useAuthStore } from "../../user/contexts/auth.context"
import { useUsersStore } from "../../user/contexts/users.context"

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
    article?: ArticleDTO
    editMode?: boolean
    empty?: boolean
}> = observer(({ children, article, editMode, empty }) => {
    const categoriesStore = useCategoriesStore()
    const auth = useAuthStore()
    const users = useUsersStore()
    const [store] = useState(() => new ArticleStore(categoriesStore))

    useEffect(() => {
        if (article) {
            if (article.mainCategory) {
                categoriesStore.upsert(article.mainCategory)
            }
            categoriesStore.upsertMany(article.categories)
            store.fromDTO(article);
            users.upsert(article.author)
        }
        else if (empty) store.createEmptyArticle();
        else return;

        if (editMode) {
            store.loadLocalDraft()
        }
        store.setEditMode(editMode ?? false)
        store.content.changePage('cover')
    }, [article, empty, editMode, users, categoriesStore, store])

    useEffect(() => {
        if (!auth.user) return
        users.upsert(auth.user)
        if (editMode) {
            store.setAuthorId(auth.user.id)
        }
    }, [auth.user, editMode, users, store])

    return (
        <ArticleContext.Provider value={store}>
            {children}
        </ArticleContext.Provider>
    )
})

export default ArticleStoreProvider
