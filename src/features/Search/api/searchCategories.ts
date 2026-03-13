import { type Category, type SearchCategoriesResponse } from "@smth/shared";
import { apiRequest } from "../../../shared/api";

export type SearchCategoriesPage = SearchCategoriesResponse["data"];

export async function searchCategories(query: string, page: number = 1, limit: number = 20): Promise<SearchCategoriesPage> {
    const response = await apiRequest<SearchCategoriesResponse>("/search/categories", {
        query: {
            q: query,
            page,
            limit,
        }
    });

    return {
        ...response.data,
        items: response.data.items as Category[],
    };
}
