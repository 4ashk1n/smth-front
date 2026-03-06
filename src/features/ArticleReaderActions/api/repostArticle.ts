import { type RepostArticleResponse } from "@smth/shared";
import type { ArticleModel } from "../../../entities/article/models/article.model";
import { apiRequest } from "../../../shared/api";

export async function repostArticle(article: ArticleModel, authUserId: string) {
    if (!authUserId) return;
    const METHOD = article.metrics.reposted ? "DELETE" : "POST";
    const response = await apiRequest<RepostArticleResponse>(`/articles/${article.id}/repost`, {
        method: METHOD,
        credentials: "include",
    });
    if (response.success) {
        article.updateMetrics({
            reposts: article.metrics.reposts + (METHOD === "POST" ? 1 : -1),
            reposted: METHOD === "POST",
        });
    }
}
