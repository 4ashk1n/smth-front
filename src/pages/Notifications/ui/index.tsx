import { Alert, Button, Group, Loader, ScrollArea, Stack, Text, Title } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { PiArrowArcLeft, PiCheckCircleDuotone, PiWarningCircleDuotone } from "react-icons/pi";
import { useNavigate } from "react-router";
import type { Notification } from "../../../entities/notification/types/notification.types";
import NotificationItem from "../../../entities/notification/ui/NotificationItem";
import { useAuthStore } from "../../../entities/user/contexts/auth.context";
import { getNotifications } from "../../../features/Notifications/api/getNotifications";
import { markAllNotificationsRead } from "../../../features/Notifications/api/markAllNotificationsRead";
import { markNotificationRead } from "../../../features/Notifications/api/markNotificationRead";

const NOTIFICATIONS_LIMIT = 20;

const NotificationsPage: React.FC = () => {
    const auth = useAuthStore();
    const navigate = useNavigate();

    const [items, setItems] = useState<Notification[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [markingAllRead, setMarkingAllRead] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const unreadCount = useMemo(() => items.filter((item) => !item.readAt).length, [items]);

    const loadPage = async (nextPage: number, mode: "replace" | "append") => {
        if (!auth.user) return;

        if (mode === "replace") setLoading(true);
        if (mode === "append") setLoadingMore(true);
        setError(null);

        try {
            const response = await getNotifications(nextPage, NOTIFICATIONS_LIMIT);
            setItems((prev) => (mode === "replace" ? response.data.items : [...prev, ...response.data.items]));
            setPage(response.data.page);
            setHasMore(response.data.hasMore);
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : "Не удалось загрузить уведомления");
        } finally {
            if (mode === "replace") setLoading(false);
            if (mode === "append") setLoadingMore(false);
        }
    };

    useEffect(() => {
        if (auth.isBanned) {
            navigate("/banned");
            return;
        }
        if (!auth.user) {
            navigate("/auth");
            return;
        }
        void loadPage(1, "replace");
    }, [auth.isBanned, auth.user, navigate]);

    const handleOpen = async (notification: Notification) => {
        if (!notification.readAt) {
            try {
                await markNotificationRead(notification.id);
                setItems((prev) => prev.map((item) => (
                    item.id === notification.id
                        ? { ...item, readAt: new Date().toISOString() }
                        : item
                )));
            } catch {
                // Keep UX smooth on click; background read status can fail silently here.
            }
        }

        const articleId = typeof notification.payload.articleId === "string" ? notification.payload.articleId : null;
        if (articleId) {
            navigate(`/article/${articleId}`);
            return;
        }

        if (notification.actor?.id) {
            navigate(`/profile/${notification.actor.id}`);
        }
    };

    const handleMarkAllRead = async () => {
        if (markingAllRead || unreadCount === 0) return;
        setMarkingAllRead(true);
        setError(null);
        try {
            await markAllNotificationsRead();
            setItems((prev) => prev.map((item) => ({
                ...item,
                readAt: item.readAt ?? new Date().toISOString(),
            })));
        } catch (markError) {
            setError(markError instanceof Error ? markError.message : "Не удалось отметить уведомления");
        } finally {
            setMarkingAllRead(false);
        }
    };

    return (
        <>
            <Group
                justify="space-between"
                w="100%"
                px={16}
                py={12}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    zIndex: 1000,
                    backdropFilter: "blur(10px)",
                    background: "rgba(0, 0, 0, 0.35)",
                }}
            >
                <Button
                    variant="white"
                    c="white"
                    bg="black"
                    style={{ border: "1px solid #808080" }}
                    radius="xl"
                    leftSection={<PiArrowArcLeft size={16} />}
                    onClick={() => navigate(-1)}
                >
                    Назад
                </Button>

                <Button
                    variant="white"
                    c={unreadCount === 0 ? "white" : "black"}
                    bg={unreadCount === 0 ? "black" : "white"}
                    style={{ border: unreadCount === 0 ? "1px solid #808080" : "none" }}
                    radius="xl"
                    loading={markingAllRead}
                    disabled={unreadCount === 0 || markingAllRead}
                    onClick={() => void handleMarkAllRead()}
                >
                    Прочитать все
                </Button>
            </Group>

            <ScrollArea scrollbars="y" type="scroll" h="calc(100vh)" scrollbarSize={0}>
                <Stack w="100%" mt={76} px={16} pb={110} gap={14}>
                    <Stack gap={4} maw={760} w="100%" mx="auto">
                        <Title order={2} fz={24} c="white">
                            Уведомления
                        </Title>
                        <Text c="white" opacity={0.6} fz={13}>
                            Непрочитано: {unreadCount}
                        </Text>
                    </Stack>

                    <hr style={{ margin: "0 auto", opacity: 0.2, width: "100%", maxWidth: 760 }} />

                    <Stack gap={10} maw={760} w="100%" mx="auto">
                        {error ? (
                            <Alert variant="light" color="red" radius={12} icon={<PiWarningCircleDuotone />}>
                                {error}
                            </Alert>
                        ) : null}

                        {loading ? (
                            <Stack align="center" py={26}>
                                <Loader color="white" size="sm" />
                            </Stack>
                        ) : null}

                        {!loading && items.length === 0 ? (
                            <Alert variant="outline" color="gray" radius={12} icon={<PiCheckCircleDuotone />}>
                                Пока нет уведомлений
                            </Alert>
                        ) : null}

                        {!loading && items.length > 0 ? (
                            <Stack gap={8}>
                                {items.map((notification) => (
                                    <NotificationItem
                                        key={notification.id}
                                        notification={notification}
                                        onClick={() => void handleOpen(notification)}
                                    />
                                ))}
                            </Stack>
                        ) : null}

                        {hasMore ? (
                            <Group justify="center" pt={4}>
                                <Button
                                    size="sm"
                                    radius="xl"
                                    variant="white"
                                    c="white"
                                    bg="black"
                                    style={{ border: "1px solid #808080" }}
                                    disabled={loadingMore}
                                    loading={loadingMore}
                                    onClick={() => void loadPage(page + 1, "append")}
                                >
                                    Показать еще
                                </Button>
                            </Group>
                        ) : null}
                    </Stack>
                </Stack>
            </ScrollArea>
        </>
    );
};

export default NotificationsPage;
