import type { ArticleCommentResponse } from "@smth/shared";
import { apiRequest } from "../../../shared/api";

export async function createArticleComment(articleId: string, text: string): Promise<ArticleCommentResponse> {
    return apiRequest<ArticleCommentResponse>(`/articles/${articleId}/comments`, {
        method: "POST",
        credentials: "include",
        body: { text },
    });
}
