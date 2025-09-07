import { Stack } from "@mantine/core"
import ArticleHeader from "../../../widgets/ArticleHeader/ui"
import { useEffect } from "react"
import { ArticleFullEmpty } from "../../../entities/article/types/ArticleFullEmpty"
import EditArticleContent from "../../../features/EditArticle/ui/EditArticleContent"
import { ArticleContext, articleStore } from "../../../features/stores/ArticleStore"

const NewArticlePage = () => {
    useEffect(() => {
        articleStore.setArticle(ArticleFullEmpty)
    }, [])

    return (<>
        <ArticleContext.Provider value={articleStore} >
            <Stack align="center" w='100%' mih='100vh' style={{ background: `linear-gradient(0deg, ${articleStore.categoryColors.accentColor}, #000000 100%)` }}>
                <Stack maw={'1280px'} w='90%'>
                    <ArticleHeader editMode/>
                    {/* <ArticleContent editMode article={draft as ArticleFull} /> */}
                    <EditArticleContent />
                </Stack>
            </Stack>
        </ArticleContext.Provider>
    </>)
}

export default NewArticlePage