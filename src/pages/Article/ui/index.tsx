import { useEffect, useState } from "react"
import type { ArticleFull } from "../../../entities/article/types/ArticleFull"
import { ARTICLE } from "../api/samples/article"
import { Center, Stack } from "@mantine/core"
import ArticleHeader from "../../../widgets/ArticleHeader/ui"
import ArticleContent from "../../../widgets/ArticleContent/ui"

const ArticlePage = () => {

    const [article, setArticle] = useState<ArticleFull | null>(null)

    useEffect(() => {
        (async () => {
            setArticle(ARTICLE as ArticleFull)
        })()
    }, [])

    if (!article) return null

    return (<>
    
        <Stack align="center" w='100%' h='100%' style={{background: `linear-gradient(0deg, ${article.mainCategory.accentColor}, #000000 100%)`}}>
            <Stack maw={'1280px'} w='90%'>
                <ArticleHeader article={article as ArticleFull} />
                <ArticleContent article={article as ArticleFull} />
                <ArticleContent article={article as ArticleFull} />
                <ArticleContent article={article as ArticleFull} />
            </Stack>
        </Stack>
    
    </>)
}

export default ArticlePage