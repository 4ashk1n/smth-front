import { SendForReviewSchema, type UpdateArticleResponse } from "@smth/shared";
import type { ArticleStore } from "../../../entities/article/stores/article.store";
import { apiRequest } from "../../../shared/api";
import { buildUpdatePayload } from "./saveEditedArticle";

type SendForReviewValidationFailure = {
    ok: false;
    invalidFields: string[];
};

type SendForReviewSuccess = {
    ok: true;
    data: UpdateArticleResponse["data"];
};

export type SendForReviewResult = SendForReviewSuccess | SendForReviewValidationFailure;

export function getInvalidFields(article: ArticleStore): string[] {
    const payload = {
        title: article.title,
        description: article.description,
        content: article.content ? article.content.toDTO() : {},
        authorId: article.authorId,
        mainCategoryId: article.mainCategoryId,
        categoryIds: article.categoryIds,
    };

    const validation = SendForReviewSchema.safeParse(payload);
    if (validation.success) return [];

    const fields = validation.error.issues.map((issue) =>
        issue.path.length > 0 ? issue.path.join(".") : "unknown"
    );

    return Array.from(new Set(fields));
}

export async function sendArticleForReview(article: ArticleStore): Promise<SendForReviewResult> {
    if (!article.id) {
        return {
            ok: false,
            invalidFields: ["id"],
        };
    }

    const invalidFields = getInvalidFields(article);
    if (invalidFields.length > 0) {
        return {
            ok: false,
            invalidFields,
        };
    }

    const payload = {
        ...buildUpdatePayload(article),
        status: "review" as const,
    };

    const response = await apiRequest<UpdateArticleResponse>(`/articles/${article.id}/review`, {
        method: "POST",
        body: payload,
        credentials: "include",
    });

    return {
        ok: true,
        data: response.data,
    };
}
