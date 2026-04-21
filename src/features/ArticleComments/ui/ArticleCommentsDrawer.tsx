import { Alert, Button, Drawer, Group, Loader, ScrollArea, Stack, Text, Textarea } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { PiChatCenteredDotsDuotone, PiPaperPlaneRightFill, PiWarningCircleDuotone } from "react-icons/pi";
import { useNavigate } from "react-router";
import CommentItem from "../../../entities/comment/ui/CommentItem";
import type { Comment } from "../../../entities/comment/types/comment.types";
import { createArticleComment } from "../api/createArticleComment";
import { deleteArticleComment } from "../api/deleteArticleComment";
import { getArticleComments } from "../api/getArticleComments";

const COMMENTS_PAGE_LIMIT = 20;

const ArticleCommentsDrawer: React.FC<{
    opened: boolean;
    articleId: string;
    commentsCount: number;
    currentUserId?: string;
    onClose: () => void;
    onCommentsCountChange: (count: number) => void;
}> = ({
    opened,
    articleId,
    commentsCount,
    currentUserId,
    onClose,
    onCommentsCountChange,
}) => {
    const navigate = useNavigate();
    const [comments, setComments] = useState<Comment[]>([]);
    const [text, setText] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [sending, setSending] = useState(false);
    const [deletingIds, setDeletingIds] = useState<Record<string, boolean>>({});
    const [error, setError] = useState<string | null>(null);

    const trimmedText = text.trim();
    const sendDisabled = trimmedText.length === 0 || sending;

    const loadComments = async (nextPage: number, mode: "replace" | "append") => {
        if (mode === "replace") {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }
        setError(null);

        try {
            const response = await getArticleComments(articleId, nextPage, COMMENTS_PAGE_LIMIT);
            const nextItems = response.data.items;
            setComments((prev) => (mode === "replace" ? nextItems : [...prev, ...nextItems]));
            setPage(response.data.page);
            setHasMore(response.data.hasMore);
            onCommentsCountChange(response.data.total);
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : "Failed to load comments");
        } finally {
            if (mode === "replace") {
                setLoading(false);
            } else {
                setLoadingMore(false);
            }
        }
    };

    useEffect(() => {
        if (!opened) return;
        void loadComments(1, "replace");
    }, [opened, articleId]);

    const handleSend = async () => {
        if (sendDisabled) return;
        if (!currentUserId) {
            navigate("/auth");
            return;
        }

        setSending(true);
        setError(null);
        try {
            const response = await createArticleComment(articleId, trimmedText);
            setComments((prev) => [response.data, ...prev]);
            setText("");
            onCommentsCountChange(commentsCount + 1);
        } catch (sendError) {
            setError(sendError instanceof Error ? sendError.message : "Failed to send comment");
        } finally {
            setSending(false);
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!currentUserId) return;

        setDeletingIds((prev) => ({ ...prev, [commentId]: true }));
        setError(null);
        try {
            await deleteArticleComment(articleId, commentId);
            setComments((prev) => prev.filter((comment) => comment.id !== commentId));
            onCommentsCountChange(Math.max(0, commentsCount - 1));
        } catch (deleteError) {
            setError(deleteError instanceof Error ? deleteError.message : "Failed to delete comment");
        } finally {
            setDeletingIds((prev) => {
                const next = { ...prev };
                delete next[commentId];
                return next;
            });
        }
    };

    const empty = useMemo(() => !loading && comments.length === 0 && !error, [loading, comments.length, error]);

    return (
        <Drawer
            opened={opened}
            onClose={onClose}
            withCloseButton={false}
            size="90%"
            position="bottom"
            radius="16px 16px 0 0"
            zIndex={1200}
            styles={{
                content: {
                    background: "#0d0d0e",
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                },
                body: {
                    padding: 0,
                    height: "100%",
                },
                overlay: {
                    backgroundColor: "#00000090",
                    backdropFilter: "blur(6px)",
                },
            }}
        >
            <Stack h="100%" gap={0}>
                <Group justify="space-between" px={16} py={12}>
                    <Text c="white" fz={14} opacity={0.65}>
                        {commentsCount}
                    </Text>
                    <Text c="white" fz={16} fw={700}>
                        Комментарии
                    </Text>
                    <Button
                        size="compact-sm"
                        variant="subtle"
                        c="white"
                        opacity={0.65}
                        onClick={onClose}
                    >
                        Закрыть
                    </Button>
                </Group>

                <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.12)" }} />

                {error ? (
                    <Alert
                        variant="light"
                        color="red"
                        radius={10}
                        icon={<PiWarningCircleDuotone />}
                        m={12}
                        p={10}
                    >
                        {error}
                    </Alert>
                ) : null}

                <ScrollArea h="100%" px={12} py={10}>
                    {loading ? (
                        <Stack align="center" py={24}>
                            <Loader color="white" size="sm" />
                        </Stack>
                    ) : null}

                    {empty ? (
                        <Stack align="center" py={40} gap={8}>
                            <PiChatCenteredDotsDuotone size={30} color="#ffffff88" />
                            <Text c="white" fw={600}>Пока нет комментариев</Text>
                            <Text c="white" opacity={0.55} fz={13}>Будьте первым</Text>
                        </Stack>
                    ) : null}

                    {!loading && comments.length > 0 ? (
                        <Stack gap={12} pb={12}>
                            {comments.map((comment) => (
                                <CommentItem
                                    key={comment.id}
                                    comment={comment}
                                    canDelete={comment.authorId === currentUserId}
                                    deleting={!!deletingIds[comment.id]}
                                    onDelete={() => void handleDelete(comment.id)}
                                />
                            ))}

                            {hasMore ? (
                                <Group justify="center">
                                    <Button
                                        size="sm"
                                        radius="xl"
                                        variant="white"
                                        c="white"
                                        bg="black"
                                        style={{ border: "1px solid #808080" }}
                                        disabled={loadingMore}
                                        loading={loadingMore}
                                        onClick={() => void loadComments(page + 1, "append")}
                                    >
                                        Показать еще
                                    </Button>
                                </Group>
                            ) : null}
                        </Stack>
                    ) : null}
                </ScrollArea>

                <Stack
                    gap={8}
                    px={12}
                    py={10}
                    style={{
                        borderTop: "1px solid rgba(255,255,255,0.12)",
                        background: "#09090a",
                    }}
                >
                    <Textarea
                        value={text}
                        onChange={(event) => setText(event.currentTarget.value)}
                        placeholder="Написать комментарий..."
                        autosize
                        minRows={1}
                        maxRows={4}
                        radius="xl"
                        styles={{
                            input: {
                                background: "rgba(255,255,255,0.07)",
                                borderColor: "rgba(255,255,255,0.14)",
                                color: "white",
                            },
                        }}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" && !event.shiftKey) {
                                event.preventDefault();
                                void handleSend();
                            }
                        }}
                    />
                    <Group justify="flex-end">
                        <Button
                            radius="xl"
                            variant="white"
                            c={sendDisabled ? "white" : "black"}
                            bg={sendDisabled ? "black" : "white"}
                            style={{ border: sendDisabled ? "1px solid #808080" : "none" }}
                            rightSection={<PiPaperPlaneRightFill size={14} />}
                            disabled={sendDisabled}
                            loading={sending}
                            onClick={() => void handleSend()}
                        >
                            Отправить
                        </Button>
                    </Group>
                </Stack>
            </Stack>
        </Drawer>
    );
};

export default ArticleCommentsDrawer;
