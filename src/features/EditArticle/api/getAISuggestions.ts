import type { AiSuggestionMode, AiSuggestionsResponse } from "@smth/shared";
import { apiRequest } from "../../../shared/api";

type GetAISuggestionsOptions = {
  mode?: AiSuggestionMode;
};

export async function getAISuggestions(
  draftId: string,
  options: GetAISuggestionsOptions = {},
): Promise<AiSuggestionsResponse> {
  if (!draftId) {
    throw new Error("Draft id is required to request AI suggestions");
  }

  const mode = options.mode ?? "all";

  return apiRequest<AiSuggestionsResponse>(`/ai/suggestions/${mode}`, {
    method: "POST",
    body: { draftId },
    credentials: "include",
  });
}
