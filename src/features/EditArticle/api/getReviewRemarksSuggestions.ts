import type { AiSuggestionsResponse } from "@smth/shared";
import { apiRequest } from "../../../shared/api";

export async function getReviewRemarksSuggestions(articleId: string): Promise<AiSuggestionsResponse> {
  if (!articleId) {
    throw new Error("Article id is required to load review remarks");
  }

  return apiRequest<AiSuggestionsResponse>(`/articles/${articleId}/review-remarks`, {
    method: "GET",
    credentials: "include",
  });
}
