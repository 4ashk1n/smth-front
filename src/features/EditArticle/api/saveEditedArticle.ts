import type { Article, ArticleUpdate, UpdateArticleResponse } from "@smth/shared";
import type { ArticleStore } from "../../../entities/article/stores/article.store";
import type { Content, Topic } from "../../../entities/article/types/content.types";
import { apiRequest } from "../../../shared/api";

function buildContentPayload(article: ArticleStore): Content {
    const topics: Topic[] = article.content.topicsData
        .filter((topic) => topic.id !== "cover")
        .map((topic) => ({
            ...topic,
            pages: topic.pages
                .filter((page) => page.topicId !== "cover")
                .sort((a, b) => a.order - b.order),
        }))
        .sort((a, b) => a.order - b.order);

    return { topics };
}

function buildUpdatePayload(article: ArticleStore): ArticleUpdate {
    const mainCategoryId = article.mainCategoryId || article.categoryIds[0] || "";

    return {
        title: article.title,
        description: article.description,
        mainCategoryId: mainCategoryId,
        categoryIds: article.categoryIds,
        content: buildContentPayload(article),
        status: article.status ?? "draft",
    };
}

export async function saveEditedArticle(article: ArticleStore): Promise<Article> {
    if (!article.id) {
        throw new Error("Article id is required to update");
    }

    const payload = buildUpdatePayload(article);
    return (await apiRequest<UpdateArticleResponse>(`/articles/${article.id}`, {
        method: "PATCH",
        body: payload,
    })).data;
}
