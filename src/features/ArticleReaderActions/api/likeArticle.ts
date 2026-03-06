import { type LikeArticleResponse } from "@smth/shared";
import type { ArticleModel } from "../../../entities/article/models/article.model";
import { apiRequest } from "../../../shared/api";

export async function likeArticle(article: ArticleModel, authUserId: string) {
    if (!authUserId) return;
    const METHOD = article.metrics.liked ? 'DELETE' : 'POST'
    const response = await apiRequest<LikeArticleResponse>(`/articles/${article.id}/like`, { method: METHOD, credentials: 'include' })
    if (response.success) {
        article.updateMetrics(
            {
                likes: article.metrics.likes + (METHOD === 'POST' ? 1 : -1),
                liked: METHOD === 'POST',
            }
        )
    }
}