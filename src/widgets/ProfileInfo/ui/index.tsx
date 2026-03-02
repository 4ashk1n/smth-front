import { Stack } from "@mantine/core"
import ProfileDescription from "../../../entities/user/ui/ProfileDescription"
import ProfileName from "../../../entities/user/ui/ProfileName"
import ProfilePhoto from "../../../entities/user/ui/ProfilePhoto"
import ProfileStats from "../../../entities/user/ui/ProfileStats"
import SubscribeButton from "../../../features/ProfileActions/ui/SubscribeButton"

const ProfileInfo = () => {
    return (
        <Stack
            align="center"
            w="100%"
            style={{ overflow: "hidden" }}
            gap={16}
        >
            <ProfilePhoto />
            <ProfileName />
            <ProfileStats />
            <SubscribeButton />
            <ProfileDescription />
        </Stack>
    )
}

export default ProfileInfo