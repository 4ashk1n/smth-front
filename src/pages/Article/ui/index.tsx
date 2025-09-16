import { useEffect, useState } from "react"
import type { ArticleFull } from "../../../entities/article/types/ArticleFull"
import { ARTICLE } from "../api/samples/article"
import { Center, Grid, Stack } from "@mantine/core"
import ArticleHeader from "../../../widgets/ArticleHeader/ui"
import ArticleContent from "../../../widgets/ArticleContent/ui"
import { useParams } from "react-router"
import { ArticleContext, articleStore } from "../../../features/stores/ArticleStore"
import ArticleBackground from "../../../widgets/ArticleContent/ui/ArticleBackground"

const ArticlePage = () => {
    useEffect(() => {
        (async () => {
            articleStore.setArticle(ARTICLE as ArticleFull)
        })()
    }, [])

    return (<>
        <ArticleContext.Provider value={articleStore} >
        <Stack align="center" w='100%' h='100%' pos='relative'>
            {/* <Stack maw={'1280px'} w='90%'> */}
                {/* <ArticleHeader article={article as ArticleFull} />
                <ArticleContent article={article as ArticleFull} /> */}
                {/* <ArticleContent article={article as ArticleFull} />
                <ArticleContent article={article as ArticleFull} /> */}
            {/* </Stack> */}
            <ArticleBackground />
            <Grid columns={4} maw={'1280px'} w='90%'>
                <Grid.Col span={1}>
                    <ArticleHeader />
                </Grid.Col>
                <Grid.Col span={2}>
                    <ArticleContent />
                </Grid.Col>
            </Grid>
        </Stack>
        </ArticleContext.Provider>
    
    </>)
}

export default ArticlePage