import { ActionIcon, Avatar, Group, Stack, Text } from "@mantine/core";
import { PiTrash } from "react-icons/pi";
import type { Comment } from "../types/comment.types";

function formatCommentTime(value: string | Date): string {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    const now = Date.now();
    const diffMs = now - date.getTime();
    const minute = 60_000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (diffMs < hour) {
        return `${Math.max(1, Math.floor(diffMs / minute))}м`;
    }
    if (diffMs < day) {
        return `${Math.max(1, Math.floor(diffMs / hour))}ч`;
    }
    return `${Math.max(1, Math.floor(diffMs / day))}д`;
}

const CommentItem: React.FC<{
    comment: Comment;
    canDelete: boolean;
    deleting: boolean;
    onDelete: () => void;
}> = ({ comment, canDelete, deleting, onDelete }) => {
    return (
        <Group align="flex-start" wrap="nowrap" gap={10}>
            <Avatar src={comment.author.avatar} size={34} radius={999} />

            <Stack gap={4} flex={1}>
                <Group gap={8} wrap="nowrap" justify="space-between">
                    <Group gap={6} wrap="nowrap">
                        <Text fz={13} fw={600} c="white" lh={1}>
                            {comment.author.firstname} {comment.author.lastname}
                        </Text>
                        <Text fz={12} c="white" opacity={0.55} lh={1}>
                            @{comment.author.username}
                        </Text>
                    </Group>

                    <Group gap={8} wrap="nowrap">
                        <Text fz={11} c="white" opacity={0.45} lh={1}>
                            {formatCommentTime(comment.createdAt)}
                        </Text>
                        {canDelete ? (
                            <ActionIcon
                                size="sm"
                                radius={999}
                                variant="subtle"
                                color="gray"
                                loading={deleting}
                                onClick={onDelete}
                            >
                                <PiTrash size={13} />
                            </ActionIcon>
                        ) : null}
                    </Group>
                </Group>

                <Text fz={14} c="white" lh={1.3}>
                    {comment.text}
                </Text>
            </Stack>
        </Group>
    );
};

export default CommentItem;
