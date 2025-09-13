import { Stack } from "@mantine/core"
import ArticleHeader from "../../../widgets/ArticleHeader/ui"
import { useEffect } from "react"
import { ArticleFullEmpty } from "../../../entities/article/types/ArticleFullEmpty"
import EditArticleContent from "../../../features/EditArticle/ui/EditArticleContent"
import { ArticleContext, articleStore } from "../../../features/stores/ArticleStore"
import EditArticleHeader from "../../../features/EditArticle/ui/header/EditArticleHeader"
import ArticleBackground from "../../../widgets/ArticleContent/ui/ArticleBackground"

const NewArticlePage = () => {
    useEffect(() => {
        articleStore.setArticle(ArticleFullEmpty)
    }, [])

    return (<>
        <ArticleContext.Provider value={articleStore} >
            <Stack align="center" w='100%' mih='100vh'>
                <ArticleBackground />
                <Stack maw={'1280px'} w='90%'>
                    <EditArticleHeader />
                    {/* <ArticleContent editMode article={draft as ArticleFull} /> */}
                    <EditArticleContent />
                </Stack>
            </Stack>
        </ArticleContext.Provider>
    </>)
}

export default NewArticlePage