import type { NotificationListResponse } from "@smth/shared";
import { apiRequest } from "../../../shared/api";

export async function getNotifications(page = 1, limit = 20): Promise<NotificationListResponse> {
    return apiRequest<NotificationListResponse>("/notifications", {
        method: "GET",
        query: {
            page,
            limit,
        },
        credentials: "include",
    });
}
