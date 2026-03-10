// import { Stack } from "@mantine/core"
// import ArticleHeader from "../../../widgets/ArticleHeader/ui"
// import { useEffect } from "react"
// import { ArticleFullEmpty } from "../../../entities/article/types/ArticleFullEmpty"
// import EditArticleContent from "../../../features/EditArticle/ui/EditArticleContent"
// import { ArticleContext, articleStore } from "../../../features/stores/ArticleStore"
// import EditArticleHeader from "../../../features/EditArticle/ui/header/EditArticleHeader"
// import ArticleBackground from "../../../widgets/ArticleContent/ui/ArticleBackground"

import { observer } from "mobx-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import ArticleStoreProvider from "../../../entities/article/contexts/article.context"
import { ArticleModel } from "../../../entities/article/models/article.model"
import { useCategoriesStore } from "../../../entities/category/contexts/categories.context"
import { useAuthStore } from "../../../entities/user/contexts/auth.context"
import { getArticleById } from "../../../features/EditArticle/api/getArticleById"
import ArticleScreen from "../../Article/ui/screen"

const NewArticlePage = observer(() => {
    const auth = useAuthStore();
    const navigate = useNavigate();
    const { id } = useParams();
    const categories = useCategoriesStore();
    const [article, setArticle] = useState<ArticleModel | null>(null);

    useEffect(() => {
        if (!auth.isAuthenticated) {
            navigate('/profile');
            return;
        }
    }, [auth.isAuthenticated, navigate])

    useEffect(() => {
        if (!id) return;

        let cancelled = false;
        const articleModel = new ArticleModel(categories);

        getArticleById(id)
            .then((articleDTO) => {
                if (cancelled) return;
                articleModel.fromDTO(articleDTO);
                setArticle(articleModel);
            })
            .catch((error) => {
                console.error("Failed to load article", error);
            });

        return () => {
            cancelled = true;
        };
    }, [id, categories]);

    if (!article) return null;

    return <>
        <ArticleStoreProvider article={article} editMode>
            <ArticleScreen />
        </ArticleStoreProvider>
    </>
})

export default NewArticlePage
