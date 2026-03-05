import { Stack } from "@mantine/core"
import type { UserModel } from "../../../entities/user/models/user.model"
import ProfileDescription from "../../../entities/user/ui/ProfileDescription"
import ProfileMetrics from "../../../entities/user/ui/ProfileMetrics"
import ProfileName from "../../../entities/user/ui/ProfileName"
import ProfilePhoto from "../../../entities/user/ui/ProfilePhoto"
import SubscribeButton from "../../../features/ProfileActions/ui/SubscribeButton"

const ProfileInfo: React.FC<{
    user: UserModel
}> = ({ user }) => {
    

    return (
        <Stack
            align="center"
            w="100%"
            style={{ overflow: "hidden" }}
            gap={16}
        >
            <ProfilePhoto user={user} />
            <ProfileName user={user} />
            <ProfileMetrics user={user} />
            <SubscribeButton user={user} />
            <ProfileDescription user={user}  />
        </Stack>
    )
}

export default ProfileInfo