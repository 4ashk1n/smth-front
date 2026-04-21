import type { ArticleCommentListResponse } from "@smth/shared";
import { apiRequest } from "../../../shared/api";

export async function getArticleComments(articleId: string, page = 1, limit = 20): Promise<ArticleCommentListResponse> {
    return apiRequest<ArticleCommentListResponse>(`/articles/${articleId}/comments`, {
        method: "GET",
        query: { page, limit },
    });
}
