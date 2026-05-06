import type { ArticleMeta, UserLikedArticlesResponse, UserOtherArticlesResponse, UserPublishedArticlesResponse, UserRepostedArticlesResponse, UserSavedArticlesResponse } from "@smth/shared";
import { apiRequest } from "../../../shared/api";
import type { ProfileTabs } from "../../../widgets/ProfileArticles/types/tabs.types";

export async function getArticlesByTab(userId: string, tab: ProfileTabs): Promise<ArticleMeta[]> {
    switch (tab) {
        case 'articles':
            return (await apiRequest<UserPublishedArticlesResponse>(`users/${userId}/articles/published`)).data;
        case 'reviews':
            return (await apiRequest<UserOtherArticlesResponse>(`users/${userId}/articles/other`, { credentials: 'include' })).data;
        case 'likes':
            return (await apiRequest<UserLikedArticlesResponse>(`users/${userId}/articles/liked`, { credentials: 'include' })).data;
        case 'saved':
            return (await apiRequest<UserSavedArticlesResponse>(`users/${userId}/articles/saved`, { credentials: 'include' })).data;
        case 'reposts':
            return (await apiRequest<UserRepostedArticlesResponse>(`users/${userId}/articles/reposted`)).data;
        default:
            return []
    }
}