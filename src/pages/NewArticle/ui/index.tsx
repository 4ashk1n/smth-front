// import { Stack } from "@mantine/core"
// import ArticleHeader from "../../../widgets/ArticleHeader/ui"
// import { useEffect } from "react"
// import { ArticleFullEmpty } from "../../../entities/article/types/ArticleFullEmpty"
// import EditArticleContent from "../../../features/EditArticle/ui/EditArticleContent"
// import { ArticleContext, articleStore } from "../../../features/stores/ArticleStore"
// import EditArticleHeader from "../../../features/EditArticle/ui/header/EditArticleHeader"
// import ArticleBackground from "../../../widgets/ArticleContent/ui/ArticleBackground"

import { observer } from "mobx-react"
import { useEffect } from "react"
import { useNavigate } from "react-router"
import ArticleStoreProvider from "../../../entities/article/contexts/article.context"
import { useAuthStore } from "../../../entities/user/contexts/auth.context"
import ArticleScreen from "../../Article/ui/screen"

const NewArticlePage = observer(() => {
    const auth = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.isAuthenticated) {
            navigate('/profile');
            return;
        }
    }, [auth.isAuthenticated])


    return <>
        <ArticleStoreProvider empty editMode>
            <ArticleScreen />
        </ArticleStoreProvider>
    </>
})

export default NewArticlePage