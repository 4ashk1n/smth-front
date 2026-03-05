import { Avatar } from "@mantine/core";
import type { UserModel } from "../models/user.model";

const ProfilePhoto: React.FC<{user: UserModel}> = ({user}) => {

    return (
        <Avatar
            src={user.data.avatar}
            w={100}
            h={100}
            size={'xl'}
        >  </Avatar>
    )
}

export default ProfilePhoto