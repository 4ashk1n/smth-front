import type { Article, ArticleUpdate, UpdateArticleResponse } from "@smth/shared";
import type { ArticleStore } from "../../../entities/article/stores/article.store";
import { apiRequest } from "../../../shared/api";

function buildUpdatePayload(article: ArticleStore): ArticleUpdate {
    const mainCategoryId = article.mainCategoryId || article.categoryIds[0] || "";

    return {
        title: article.title,
        description: article.description,
        mainCategoryId: mainCategoryId ? mainCategoryId : null,
        categoryIds: article.categoryIds,
        content: article.content ? article.content.toDTO() : {},
        status: article.status ?? "draft",
    };
}

export async function saveEditedArticle(article: ArticleStore): Promise<Article> {
    if (!article.id) {
        throw new Error("Article id is required to update");
    }

    const payload = buildUpdatePayload(article);
    return (await apiRequest<UpdateArticleResponse>(`/articles/${article.id}/draft`, {
        method: "POST",
        body: payload,
        credentials: "include",
    })).data;
}
