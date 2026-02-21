// import { Stack } from "@mantine/core"
// import ArticleHeader from "../../../widgets/ArticleHeader/ui"
// import { useEffect } from "react"
// import { ArticleFullEmpty } from "../../../entities/article/types/ArticleFullEmpty"
// import EditArticleContent from "../../../features/EditArticle/ui/EditArticleContent"
// import { ArticleContext, articleStore } from "../../../features/stores/ArticleStore"
// import EditArticleHeader from "../../../features/EditArticle/ui/header/EditArticleHeader"
// import ArticleBackground from "../../../widgets/ArticleContent/ui/ArticleBackground"

import ArticleStoreProvider from "../../../entities/article/contexts/article.context"
import ArticleScreen from "../../Article/ui/screen"

const NewArticlePage = () => {
    return <>
        <ArticleStoreProvider empty editMode>
            <ArticleScreen />
        </ArticleStoreProvider>
    </>
}

export default NewArticlePage