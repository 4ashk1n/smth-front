import type { MarkAllNotificationsReadResponse } from "@smth/shared";
import { apiRequest } from "../../../shared/api";

export async function markAllNotificationsRead(): Promise<MarkAllNotificationsReadResponse> {
    return apiRequest<MarkAllNotificationsReadResponse>("/notifications/read-all", {
        method: "POST",
        credentials: "include",
    });
}
