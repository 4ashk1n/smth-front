import { Stack, Text } from "@mantine/core";
import { useAuthStore } from "../contexts/auth.context";

const ProfileName = () => {
    const { user } = useAuthStore();
    if (!user) {
        return null;
    }

    return (
        <Stack gap={4} align="center">
            <Text
                fz={16}
                lh={1}
                fw={600}
                c='white'
            >
                { user.firstname } { user.lastname }
            </Text>
            <Text
                fz={14}
                lh={1}
                fw={400}
                c='white'
                opacity={0.5}
            >
                @{ user.username }
            </Text>
        </Stack>

    )
}

export default ProfileName