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
    const mainCategoryId = article.mainCategory?.id || article.categories[0]?.id || "";

    return {
        id: article.id,
        title: article.title,
        description: article.description,
        mainCategory: mainCategoryId,
        categoryIds: article.categories.map((category) => category.id),
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
