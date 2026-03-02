import type { Article, ArticleCreate } from "@smth/shared";
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

function buildCreatePayload(article: ArticleStore): ArticleCreate {
    const mainCategoryId = article.mainCategoryId || article.categoryIds[0] || "";

    return {
    // id: article.id,
        title: article.title,
        authorId: article.authorId,
        description: article.description,
        mainCategoryId: mainCategoryId,
        categoryIds: article.categoryIds,
        categories: article.categoryIds,
        content: buildContentPayload(article),
        status: article.status ?? "draft",
    };
}

export async function saveNewArticle(article: ArticleStore): Promise<Article> {
    const payload = buildCreatePayload(article);
    return apiRequest<Article>("/articles", {
        method: "POST",
        body: payload,
    });
}
