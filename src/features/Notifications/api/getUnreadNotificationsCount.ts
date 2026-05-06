import type { UnreadNotificationsCountResponse } from "@smth/shared";
import { apiRequest } from "../../../shared/api";

export async function getUnreadNotificationsCount(): Promise<UnreadNotificationsCountResponse> {
    return apiRequest<UnreadNotificationsCountResponse>("/notifications/unread-count", {
        method: "GET",
        credentials: "include",
    });
}
