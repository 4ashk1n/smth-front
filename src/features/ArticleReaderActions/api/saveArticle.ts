import { type SaveArticleResponse } from "@smth/shared";
import type { ArticleModel } from "../../../entities/article/models/article.model";
import { apiRequest } from "../../../shared/api";

export async function saveArticle(article: ArticleModel, authUserId: string) {
    if (!authUserId) return;
    const METHOD = article.metrics.saved ? "DELETE" : "POST";
    const response = await apiRequest<SaveArticleResponse>(`/articles/${article.id}/save`, {
        method: METHOD,
        credentials: "include",
    });
    if (response.success) {
        article.updateMetrics({
            saves: article.metrics.saves + (METHOD === "POST" ? 1 : -1),
            saved: METHOD === "POST",
        });
    }
}
