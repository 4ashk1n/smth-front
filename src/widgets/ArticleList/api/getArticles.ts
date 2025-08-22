import type { GetArticleCardDTO } from "smth-shared/src/dto/article.dto"
import { ARTICLES } from "./samples/articles"

export async function getArticles(): Promise<GetArticleCardDTO[]> {
    /* const response = await fetch('/articles', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const data = await response.json() */

    const data = ARTICLES as GetArticleCardDTO[];
    return data
}