import type { ArticleStore } from "../../../entities/article/stores/article.store";
import { apiRequest } from "../../../shared/api";

export async function deleteArticle(article: ArticleStore): Promise<void> {
    if (!article.id) {
        throw new Error("Article id is required to delete");
    }

    await apiRequest(`/articles/${article.id}/draft`, {
        method: "DELETE",
        responseType: "text",
        credentials: "include",
    });
}
