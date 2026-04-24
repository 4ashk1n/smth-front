import type { MarkNotificationReadResponse } from "@smth/shared";
import { apiRequest } from "../../../shared/api";

export async function markNotificationRead(notificationId: string): Promise<MarkNotificationReadResponse> {
    return apiRequest<MarkNotificationReadResponse>(`/notifications/${notificationId}/read`, {
        method: "POST",
        credentials: "include",
    });
}
