import { GetArticleCardDTO } from "smth-shared/src/dto/article.dto";
import SmallArticleCard from "../../../entities/article/ui/SmallArticleCard";
import { useEffect, useState } from "react";
import { getArticles } from "../api/getArticles";

const ArticleList = () => {
    const [articles, setArticles] = useState<GetArticleCardDTO[]>([])
   
    useEffect(() => {
        (async () => {
            setArticles(await getArticles())
        })()
    }, [])
    
    return (
        <div>
            {
                articles.map(article => <SmallArticleCard {...article} />   )
            }
        </div>
    )
}

export default ArticleList;