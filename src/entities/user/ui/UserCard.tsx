import { Avatar, Group, Skeleton, Stack, Text } from "@mantine/core";
import type { UserMeta } from "@smth/shared";

const UserCard: React.FC<{
    user?: UserMeta;
    loading?: boolean;
    onClick?: () => void;
}> = ({ user, loading = false, onClick }) => {
    if (!loading && !user) return null;

    return (
        <Group
            p={12}
            mx={16}
            justify="space-between"
            style={{
                borderRadius: 10,
                background: "rgba(255, 255, 255, 0.06)",
                cursor: user ? "pointer" : "default",
            }}
            onClick={onClick}
        >
            <Group gap={"12px"} wrap="nowrap">
                <Skeleton visible={loading} w={"fit-content"} circle>
                    <Avatar
                        src={user?.avatar}
                        size={44}
                        radius={999}
                    />
                </Skeleton>

                <Stack gap={4}>
                    <Skeleton visible={loading}>
                        <Text fz={16} fw={600} lh={1.1}>
                            {user ? `${user.firstname} ${user.lastname}` : "User Name"}
                        </Text>
                    </Skeleton>
                    <Skeleton visible={loading}>
                        <Text fz={14} opacity={0.7} lh={1}>
                            {user ? `@${user.username}` : "@username"}
                        </Text>
                    </Skeleton>
                </Stack>
            </Group>
        </Group>
    );
};

export default UserCard;
