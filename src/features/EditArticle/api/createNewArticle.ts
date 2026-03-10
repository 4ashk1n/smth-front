import type { CreateEmptyDraftResponse } from "@smth/shared";
import { apiRequest } from "../../../shared/api";

export async function createNewArticle(userId: string): Promise<string> {
    return (await apiRequest<CreateEmptyDraftResponse>(`/articles/empty-draft`, {
        method: "POST",
        body: {
            authorId: userId,
        },
        credentials: "include",
    })).data.id;
}
