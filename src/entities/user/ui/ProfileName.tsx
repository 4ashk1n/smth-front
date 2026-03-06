import { Stack, Text } from "@mantine/core";
import type { UserModel } from "../models/user.model";

const ProfileName: React.FC<{
    user: UserModel
}> = ({ user }) => {

    return (
        <Stack gap={4} align="center">
            <Text
                fz={16}
                lh={1}
                fw={600}
                c='white'
            >
                { user.data.firstname } { user.data.lastname }
            </Text>
            <Text
                fz={14}
                lh={1}
                fw={400}
                c='white'
                opacity={0.5}
            >
                @{ user.data.username }
            </Text>
        </Stack>

    )
}

export default ProfileName