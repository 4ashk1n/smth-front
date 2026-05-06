import { Avatar, Box, Group, Stack, Text } from "@mantine/core";
import { PiArticleDuotone, PiChatCircleTextDuotone, PiHeartDuotone, PiUserPlusDuotone } from "react-icons/pi";
import type { Notification } from "../types/notification.types";

function formatRelativeTime(value: string | Date): string {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    const diffMs = Date.now() - date.getTime();
    const minute = 60_000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (diffMs < hour) return `${Math.max(1, Math.floor(diffMs / minute))}м`;
    if (diffMs < day) return `${Math.max(1, Math.floor(diffMs / hour))}ч`;
    return `${Math.max(1, Math.floor(diffMs / day))}д`;
}

function getNotificationText(notification: Notification): string {
    const actorName = notification.actor
        ? `${notification.actor.firstname} ${notification.actor.lastname}`.trim() || `@${notification.actor.username}`
        : "Система";

    switch (notification.type) {
        case "like":
            return `${actorName} лайкнул(а) вашу статью`;
        case "subscribe":
            return `${actorName} подписался(лась) на вас`;
        case "comment":
            return `${actorName} оставил(а) комментарий`;
        case "article_status":
            return `Статус статьи изменен: ${String(notification.payload.fromStatus ?? "unknown")} → ${String(notification.payload.toStatus ?? "unknown")}`;
        default:
            return "Новое уведомление";
    }
}

function getNotificationIcon(type: Notification["type"]) {
    if (type === "like") return <PiHeartDuotone size={18} color="#ff4d4f" />;
    if (type === "subscribe") return <PiUserPlusDuotone size={18} color="white" />;
    if (type === "comment") return <PiChatCircleTextDuotone size={18} color="white" />;
    return <PiArticleDuotone size={18} color="white" />;
}

const NotificationItem: React.FC<{
    notification: Notification;
    onClick: () => void;
}> = ({ notification, onClick }) => {
    const unread = !notification.readAt;
    const articleTitle = typeof notification.payload.articleTitle === "string" ? notification.payload.articleTitle : "";

    return (
        <Group
            justify="space-between"
            align="flex-start"
            wrap="nowrap"
            p={12}
            gap={10}
            style={{
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 12,
                background: unread ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
                cursor: "pointer",
            }}
            onClick={onClick}
        >
            <Group align="flex-start" wrap="nowrap" gap={10} flex={1}>
                {notification.actor ? (
                    <Avatar src={notification.actor.avatar} size={36} radius={999} />
                ) : (
                    <Box
                        w={36}
                        h={36}
                        style={{
                            borderRadius: 999,
                            border: "1px solid rgba(255,255,255,0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(255,255,255,0.04)",
                        }}
                    >
                        {getNotificationIcon(notification.type)}
                    </Box>
                )}

                <Stack gap={2} flex={1}>
                    <Text c="white" fz={14} fw={unread ? 600 : 500} lh={1.25}>
                        {getNotificationText(notification)}
                    </Text>

                    {articleTitle ? (
                        <Text c="white" opacity={0.6} fz={12} lh={1.2}>
                            {articleTitle}
                        </Text>
                    ) : null}
                </Stack>
            </Group>

            <Stack gap={6} align="flex-end">
                <Text c="white" opacity={0.55} fz={11} lh={1}>
                    {formatRelativeTime(notification.createdAt)}
                </Text>
                {unread ? (
                    <Box
                        w={8}
                        h={8}
                        style={{
                            borderRadius: 999,
                            background: "white",
                        }}
                    />
                ) : null}
            </Stack>
        </Group>
    );
};

export default NotificationItem;
