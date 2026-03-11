import { type ArticleMeta, type SearchArticlesResponse } from "@smth/shared";
import { apiRequest } from "../../../shared/api";

export type SearchArticlesPage = SearchArticlesResponse["data"];

export async function searchArticles(query: string, page: number = 1, limit: number = 12): Promise<SearchArticlesPage> {
    const response = await apiRequest<SearchArticlesResponse>("/search/articles", {
        query: {
            q: query,
            page,
            limit,
        }
    });

    return {
        ...response.data,
        items: response.data.items as ArticleMeta[],
    };
}
