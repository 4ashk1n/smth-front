import type { ArticleDTO, ArticleResponse } from "@smth/shared";
import { apiRequest } from "../../../shared/api";

export async function getArticleById(articleId: string): Promise<ArticleDTO> {
    return (await apiRequest<ArticleResponse>(`/articles/${articleId}`, {
        credentials: "include",
    })).data;
}
