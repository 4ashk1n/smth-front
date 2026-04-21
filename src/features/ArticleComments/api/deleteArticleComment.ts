import type { DeleteArticleCommentResponse } from "@smth/shared";
import { apiRequest } from "../../../shared/api";

export async function deleteArticleComment(articleId: string, commentId: string): Promise<DeleteArticleCommentResponse> {
    return apiRequest<DeleteArticleCommentResponse>(`/articles/${articleId}/comments/${commentId}`, {
        method: "DELETE",
        credentials: "include",
    });
}
