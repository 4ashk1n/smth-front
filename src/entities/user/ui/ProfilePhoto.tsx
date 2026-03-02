import { Avatar } from "@mantine/core";
import { useAuthStore } from "../contexts/auth.context";

const ProfilePhoto = () => {
    const { user } = useAuthStore();

    return (
        <Avatar
            src={user?.avatar || null}
            w={100}
            h={100}
            size={'xl'}
        >  </Avatar>
    )
}

export default ProfilePhoto