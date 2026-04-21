import type { UpdateUserProfileResponse, UserProfileUpdate } from "@smth/shared";
import { apiRequest } from "../../../shared/api";

export type ProfileSettingsPatch = Pick<UserProfileUpdate, "firstname" | "lastname" | "username" | "avatar">;

export async function updateProfileSettings(
    userId: string,
    patch: ProfileSettingsPatch,
): Promise<UpdateUserProfileResponse["data"]> {
    const response = await apiRequest<UpdateUserProfileResponse>(`/users/${userId}`, {
        method: "PATCH",
        credentials: "include",
        body: patch,
    });

    return response.data;
}
