import { GetArticleCardDTO } from "smth-shared/src/dto/article.dto";
import { useEffect, useState } from "react";
import { getArticles } from "../api/getArticles";
import ArticleCard from "../../ArticleCard/ui/ArticleCard";
import Grid_4s1b1c from "./grids/4s1b1c";

const ArticleList = () => {
    const [articles, setArticles] = useState<GetArticleCardDTO[]>([])
   
    useEffect(() => {
        (async () => {
            setArticles(await getArticles())
        })()
    }, [])

    if (articles.length === 0) return null
    
    return (
        <Grid_4s1b1c articles={articles} category={articles[0].mainCategory} />
    )
}

export default ArticleList;