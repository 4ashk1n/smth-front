import { Alert, Box, Group, Loader, Stack, Switch, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { observer } from "mobx-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PiCameraDuotone, PiCheckCircleDuotone, PiWarningCircleDuotone } from "react-icons/pi";
import { useAuthStore } from "../../entities/user/contexts/auth.context";
import { useUsersStore } from "../../entities/user/contexts/users.context";
import type { UserModel } from "../../entities/user/models/user.model";
import type { User } from "../../entities/user/types/user.types";
import { resolveUploadedS3Url, type S3ConfirmPayloadLike, uploadFileToS3 } from "../../shared/api";
import ImageInput from "../../shared/ui/inputs/ImageInput/ui";
import { type ProfileSettingsPatch, updateProfileSettings } from "./api/updateProfileSettings";

type ProfileSettingsValues = {
    firstname: string;
    lastname: string;
    username: string;
    avatar: string;
};

type NotificationSettingsValues = {
    likes: boolean;
    comments: boolean;
    subscriptions: boolean;
    articleStatus: boolean;
};

type ConfirmUploadResponse = S3ConfirmPayloadLike;

export type ProfileSettingsState = {
    isDirty: boolean;
    isSaving: boolean;
    canSubmit: boolean;
};

export type ProfileSettingsActions = {
    submit: () => void;
    reset: () => void;
};

type ProfileSettingsProps = {
    userId?: string;
    onStateChange?: (state: ProfileSettingsState) => void;
    onRegisterActions?: (actions: ProfileSettingsActions) => void;
};

const PREPARE_UPLOAD_PATH = (import.meta.env.VITE_S3_IMAGE_PREPARE_PATH as string | undefined) ?? "/uploads/images/upload-url";
const CONFIRM_UPLOAD_PATH = (import.meta.env.VITE_S3_IMAGE_CONFIRM_PATH as string | undefined) ?? "/uploads/images/confirm";
const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettingsValues = {
    likes: true,
    comments: true,
    subscriptions: true,
    articleStatus: true,
};

function mapUserToNotificationSettings(user: User): NotificationSettingsValues {
    const settings = user.notificationSettings;
    if (!settings) return DEFAULT_NOTIFICATION_SETTINGS;
    return {
        likes: settings.likes ?? DEFAULT_NOTIFICATION_SETTINGS.likes,
        comments: settings.comments ?? DEFAULT_NOTIFICATION_SETTINGS.comments,
        subscriptions: settings.subscriptions ?? DEFAULT_NOTIFICATION_SETTINGS.subscriptions,
        articleStatus: settings.articleStatus ?? DEFAULT_NOTIFICATION_SETTINGS.articleStatus,
    };
}

function mapUserToFormValues(user: User): ProfileSettingsValues {
    return {
        firstname: user.firstname ?? "",
        lastname: user.lastname ?? "",
        username: user.username ?? "",
        avatar: user.avatar ?? "",
    };
}

const FIELDS: Array<keyof ProfileSettingsValues> = ["firstname", "lastname", "username", "avatar"];

const ProfileSettings: React.FC<ProfileSettingsProps> = observer(({ userId, onStateChange, onRegisterActions }) => {
    const auth = useAuthStore();
    const users = useUsersStore();

    const [user, setUser] = useState<UserModel | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
    const [initialValues, setInitialValues] = useState<ProfileSettingsValues | null>(null);
    const [notificationSettings, setNotificationSettings] = useState<NotificationSettingsValues>(DEFAULT_NOTIFICATION_SETTINGS);
    const [initialNotificationSettings, setInitialNotificationSettings] = useState<NotificationSettingsValues>(DEFAULT_NOTIFICATION_SETTINGS);

    const form = useForm<ProfileSettingsValues>({
        mode: "controlled",
        initialValues: {
            firstname: "",
            lastname: "",
            username: "",
            avatar: "",
        },
        validate: {
            firstname: (value) => (value.trim().length === 0 ? "Required" : null),
            lastname: (value) => (value.trim().length === 0 ? "Required" : null),
            username: (value) => {
                if (value.trim().length === 0) return "Required";
                if (value.trim().length < 3) return "At least 3 chars";
                return null;
            },
        },
    });

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);
            setLastSavedAt(null);

            if (!auth.user) {
                setUser(null);
                setLoading(false);
                return;
            }

            const targetUserId = userId ?? auth.user.id;
            if (targetUserId !== auth.user.id) {
                setError("You can edit only your profile");
                setUser(null);
                setLoading(false);
                return;
            }

            const loadedUser = await users.fetchById(targetUserId);
            if (!loadedUser) {
                setError("Could not load profile");
                setLoading(false);
                return;
            }

            const mappedValues = mapUserToFormValues(loadedUser.data);
            const loadedNotificationSettings = mapUserToNotificationSettings(loadedUser.data);

            setUser(loadedUser);
            setInitialValues(mappedValues);
            setNotificationSettings(loadedNotificationSettings);
            setInitialNotificationSettings(loadedNotificationSettings);
            form.setValues(mappedValues);
            setLoading(false);
        };

        void load();
    }, [auth.user, userId, users]);

    const profileHasChanges = useMemo(() => {
        if (!initialValues) return false;
        return FIELDS.some((field) => initialValues[field] !== form.values[field]);
    }, [form.values, initialValues]);

    const notificationHasChanges = useMemo(() => {
        const fields: Array<keyof NotificationSettingsValues> = ["likes", "comments", "subscriptions", "articleStatus"];
        return fields.some((field) => notificationSettings[field] !== initialNotificationSettings[field]);
    }, [initialNotificationSettings, notificationSettings]);

    const hasChanges = profileHasChanges || notificationHasChanges;
    const busy = saving || avatarUploading || loading;

    const handleReset = useCallback(() => {
        if (!initialValues) return;
        form.setValues(initialValues);
        setNotificationSettings(initialNotificationSettings);
        setError(null);
        setLastSavedAt(null);
    }, [form, initialNotificationSettings, initialValues]);

    const handleSubmit = useCallback(async (values: ProfileSettingsValues) => {
        if (!user) return;

        if (profileHasChanges) {
            const validation = form.validate();
            if (validation.hasErrors) return;
        }

        if (!hasChanges) return;

        setSaving(true);
        setError(null);

        try {
            const patch: ProfileSettingsPatch = {};
            if (profileHasChanges) {
                patch.firstname = values.firstname.trim();
                patch.lastname = values.lastname.trim();
                patch.username = values.username.trim();
                patch.avatar = values.avatar.trim();
            }
            if (notificationHasChanges) {
                const changedNotificationSettings: Partial<NotificationSettingsValues> = {};
                const fields: Array<keyof NotificationSettingsValues> = ["likes", "comments", "subscriptions", "articleStatus"];
                for (const field of fields) {
                    if (notificationSettings[field] !== initialNotificationSettings[field]) {
                        changedNotificationSettings[field] = notificationSettings[field];
                    }
                }
                if (Object.keys(changedNotificationSettings).length > 0) {
                    patch.notificationSettings = changedNotificationSettings;
                }
            }

            const updatedUser = await updateProfileSettings(user.id, patch);
            user.update(updatedUser);

            if (auth.user?.id === user.id) {
                auth.setUser({
                    ...auth.user,
                    ...updatedUser,
                });
            }

            const nextValues = mapUserToFormValues({
                ...user.data,
                ...updatedUser,
            });

            form.setValues(nextValues);
            setInitialValues(nextValues);
            if (updatedUser.notificationSettings) {
                const nextNotificationSettings = mapUserToNotificationSettings(updatedUser);
                setNotificationSettings(nextNotificationSettings);
                setInitialNotificationSettings(nextNotificationSettings);
            } else if (notificationHasChanges) {
                setInitialNotificationSettings(notificationSettings);
            }

            setLastSavedAt(new Date());
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : "Could not save profile");
        } finally {
            setSaving(false);
        }
    }, [auth, form, hasChanges, notificationHasChanges, notificationSettings, profileHasChanges, user]);

    const submitExternally = useCallback(() => {
        if (busy || !hasChanges) return;
        void handleSubmit(form.values);
    }, [busy, form.values, handleSubmit, hasChanges]);

    const handleAvatarLoad = useCallback(async (previewUrl: string, file: File) => {
        form.setFieldValue("avatar", previewUrl);
        setError(null);
        setAvatarUploading(true);

        try {
            const uploadResult = await uploadFileToS3<unknown, ConfirmUploadResponse>({
                file,
                fileName: file.name,
                contentType: file.type,
                prepare: {
                    path: PREPARE_UPLOAD_PATH,
                    method: "POST",
                    credentials: "include",
                    body: ({ fileName, contentType }: { fileName: string; contentType: string }) => ({
                        filename: fileName,
                        contentType,
                    }),
                },
                confirm: {
                    path: CONFIRM_UPLOAD_PATH,
                    method: "POST",
                    credentials: "include",
                    body: ({ key }: { key: string }) => ({ key }),
                },
            });

            const uploadedUrl = resolveUploadedS3Url(uploadResult.key, uploadResult.confirmResponse);
            if (uploadedUrl) {
                form.setFieldValue("avatar", uploadedUrl);
            }
        } catch (uploadError) {
            setError(uploadError instanceof Error ? uploadError.message : "Avatar upload failed");
        } finally {
            setAvatarUploading(false);
        }
    }, [form]);

    useEffect(() => {
        onStateChange?.({
            isDirty: hasChanges,
            isSaving: busy,
            canSubmit: !loading && !!user && !busy,
        });
    }, [busy, hasChanges, loading, onStateChange, user]);

    useEffect(() => {
        onRegisterActions?.({
            submit: submitExternally,
            reset: handleReset,
        });
    }, [handleReset, onRegisterActions, submitExternally]);

    if (loading) {
        return (
            <Stack w="100%" align="center" py={40}>
                <Loader color="white" size="sm" />
                <Text c="white" opacity={0.6} fz={13}>Загрузка...</Text>
            </Stack>
        );
    }

    if (!auth.user || !user) {
        return (
            <Alert variant="outline" color="gray" radius={12} title="Profile unavailable" icon={<PiWarningCircleDuotone />}>
                Please sign in and try again.
            </Alert>
        );
    }

    return (
        <Stack gap={16} w="100%">
            {error ? (
                <Alert variant="light" color="red" radius={12} icon={<PiWarningCircleDuotone />}>
                    {error}
                </Alert>
            ) : null}

            {lastSavedAt ? (
                <Alert variant="light" color="green" radius={12} icon={<PiCheckCircleDuotone />}>
                    Сохранено
                </Alert>
            ) : null}

            <Group gap={16} align="flex-start" wrap="wrap">
                <Stack gap={8} align="center">
                    <Box pos="relative" w={112} h={112}>
                        <ImageInput
                            onImageLoad={handleAvatarLoad}
                            onImageClear={() => {
                                form.setFieldValue("avatar", "");
                            }}
                            valueUrl={form.values.avatar || undefined}
                            showClearButton={false}
                            allowReplace
                            dropzoneProps={{
                                w: "112px",
                                h: "112px",
                                c: "white",
                                radius: "112px",
                                disabled: busy,
                            }}
                            style={{
                                width: 112,
                                height: 112,
                                borderRadius: "112px",
                                overflow: "hidden",
                                position: "relative",
                                border: "1px solid #808080",
                                backgroundColor: "#1a1a1a",
                            }}
                        />
                        <Box
                            style={{
                                position: "absolute",
                                right: -2,
                                bottom: -2,
                                width: 34,
                                height: 34,
                                borderRadius: 34,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "black",
                                border: "1px solid #808080",
                                pointerEvents: "none",
                            }}
                        >
                            <PiCameraDuotone size={16} color="white" />
                        </Box>
                    </Box>
                    <Text c="white" opacity={0.65} fz={12}>
                        {avatarUploading ? "Загрузка..." : "Аватар"}
                    </Text>
                </Stack>

                <Stack gap={10} flex={1} miw={260}>
                    <TextInput
                        label="Имя"
                        placeholder="Имя"
                        disabled={busy}
                        required
                        radius="md"
                        styles={{ label: { color: "white" } }}
                        {...form.getInputProps("firstname")}
                    />
                    <TextInput
                        label="Фамилия"
                        placeholder="Фамилия"
                        disabled={busy}
                        radius="md"
                        styles={{ label: { color: "white" } }}
                        {...form.getInputProps("lastname")}
                    />
                    <TextInput
                        required
                        label="Username"
                        placeholder="username"
                        disabled={busy}
                        radius="md"
                        styles={{ label: { color: "white" } }}
                        {...form.getInputProps("username")}
                    />
                </Stack>
            </Group>

            <Stack gap={10}>
                <Title order={4} fz={16} c="white">
                    Настройки уведомлений
                </Title>

                <Switch
                    color="dark.9"
                    checked={notificationSettings.likes}
                    disabled={busy}
                    label="Лайки на мои статьи"
                    styles={{ label: { color: "white" } }}
                    onChange={(event) => {
                        setNotificationSettings((prev) => ({ ...prev, likes: event.currentTarget.checked }));
                    }}
                />
                <Switch
                    color="dark.9"
                    checked={notificationSettings.comments}
                    disabled={busy}
                    label="Комментарии к моим статьям"
                    styles={{ label: { color: "white" } }}
                    onChange={(event) => {
                        setNotificationSettings((prev) => ({ ...prev, comments: event.currentTarget.checked }));
                    }}
                />
                <Switch
                    color="dark.9"
                    checked={notificationSettings.subscriptions}
                    disabled={busy}
                    label="Новые подписчики"
                    styles={{ label: { color: "white" } }}
                    onChange={(event) => {
                        setNotificationSettings((prev) => ({ ...prev, subscriptions: event.currentTarget.checked }));
                    }}
                />
                <Switch
                    color="dark.9"
                    checked={notificationSettings.articleStatus}
                    disabled={busy}
                    label="Решение модерации по статье"
                    styles={{ label: { color: "white" } }}
                    onChange={(event) => {
                        setNotificationSettings((prev) => ({ ...prev, articleStatus: event.currentTarget.checked }));
                    }}
                />
            </Stack>
        </Stack>
    );
});

export default ProfileSettings;




