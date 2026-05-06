import { type SearchUsersResponse } from "@smth/shared";
import { apiRequest } from "../../../shared/api";

export type SearchUsersPage = SearchUsersResponse["data"];

export async function searchUsers(query: string, page: number = 1, limit: number = 20): Promise<SearchUsersPage> {
    const response = await apiRequest<SearchUsersResponse>("/search/users", {
        query: {
            q: query,
            page,
            limit,
        }
    });

    return response.data;
}
