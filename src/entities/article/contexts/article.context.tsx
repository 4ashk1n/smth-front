import { observer } from "mobx-react";
import { createContext, useContext, useEffect, useState } from "react";
import { useCategoriesStore } from "../../category/contexts/categories.context";
import { useAuthStore } from "../../user/contexts/auth.context";
import { useUsersStore } from "../../user/contexts/users.context";
import { ArticleModel } from "../models/article.model";
import { ArticlesStore } from "../stores/articles.store";

const ArticlesContext = createContext<ArticlesStore | null>(null);
const ArticleScopeContext = createContext<string | null>(null);

export const useArticleStore = () => {
    const articlesStore = useContext(ArticlesContext);
    const articleId = useContext(ArticleScopeContext);

    if (!articlesStore || !articleId) {
        throw new Error("useArticleStore must be used within a ArticleProvider");
    }

    const article = articlesStore.getById(articleId);
    if (!article) {
        throw new Error(`Article "${articleId}" not found in ArticlesStore`);
    }

    return article;
};

export const useArticlesStore = () => {
    const context = useContext(ArticlesContext);
    if (!context) {
        throw new Error("useArticlesStore must be used within a ArticleProvider");
    }
    return context;
};

export const ArticlesProvider: React.FC<{
    children: React.ReactNode;
    store: ArticlesStore;
}> = ({ children, store }) => {
    return (
        <ArticlesContext.Provider value={store}>
            {children}
        </ArticlesContext.Provider>
    );
};

export const ArticleScopeProvider: React.FC<{
    children: React.ReactNode;
    articleId: string;
}> = ({ children, articleId }) => {
    return (
        <ArticleScopeContext.Provider value={articleId}>
            {children}
        </ArticleScopeContext.Provider>
    );
};

const ArticleStoreProvider: React.FC<{
    children: React.ReactNode;
    article?: ArticleModel;
    editMode?: boolean;
    empty?: boolean;
    emptyArticleId?: string;
}> = observer(({ children, article, editMode, empty, emptyArticleId }) => {
    const parentArticlesStore = useContext(ArticlesContext);
    const categoriesStore = useCategoriesStore();
    const auth = useAuthStore();
    const users = useUsersStore();
    const [localArticlesStore] = useState(() => new ArticlesStore(categoriesStore));
    const articlesStore = parentArticlesStore ?? localArticlesStore;

    const [scopeArticleId, setScopeArticleId] = useState<string>(() => {
        if (article) {
            articlesStore.upsert(article);
            return article.id;
        }

        if (empty) {
            const emptyArticle = articlesStore.createEmptyArticle(emptyArticleId);
            return emptyArticle.id;
        }

        return "";
    });

    useEffect(() => {
        let currentArticle: ArticleModel | undefined;

        if (article) {
            currentArticle = articlesStore.upsert(article);
            setScopeArticleId(currentArticle.id);
        } else if (empty) {
            currentArticle =
                articlesStore.getById(scopeArticleId) ??
                (emptyArticleId ? articlesStore.getById(emptyArticleId) : undefined) ??
                articlesStore.createEmptyArticle(emptyArticleId);
            setScopeArticleId(currentArticle.id);
        } else {
            return;
        }

        currentArticle.setEditMode(editMode ?? false);
        if (editMode && !window.location.pathname.includes("/edit")) {
            currentArticle.loadLocalDraft();
        }

        if (empty) {
            currentArticle.content?.changePage("cover");
            return;
        }

        if (!currentArticle.content || currentArticle.content.blocks.size === 0) {
            currentArticle.fetchContent().then((content) => content.changePage("cover"));
            return;
        }
        currentArticle.content.changePage("cover");
    }, [article, empty, editMode, articlesStore, scopeArticleId, emptyArticleId]);

    useEffect(() => {
        if (!scopeArticleId) return;
        const currentArticle = articlesStore.getById(scopeArticleId);
        if (!currentArticle) return;
        if (!auth.user) return;

        users.upsert(auth.user);
        if (editMode) {
            currentArticle.setAuthorId(auth.user.id);
        }
    }, [auth.user, editMode, users, articlesStore, scopeArticleId]);

    return (
        <ArticlesContext.Provider value={articlesStore}>
            <ArticleScopeContext.Provider value={scopeArticleId || null}>
                {children}
            </ArticleScopeContext.Provider>
        </ArticlesContext.Provider>
    );
});

export default ArticleStoreProvider;
