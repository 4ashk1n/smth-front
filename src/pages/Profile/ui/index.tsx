import { ScrollArea, Stack } from "@mantine/core";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useAuthStore } from "../../../entities/user/contexts/auth.context";
import { useUsersStore } from "../../../entities/user/contexts/users.context";
import type { UserModel } from "../../../entities/user/models/user.model";
import ProfileArticles from "../../../widgets/ProfileArticles/ui";
import ProfileInfo from "../../../widgets/ProfileInfo/ui";

const ProfilePage = observer(() => {
    const auth = useAuthStore();
    const params = useParams()
    const [user, setUser] = useState<UserModel | null>(null)
    const [loading, setLoading] = useState(true)
    const users = useUsersStore()

    useEffect(() => {
        setLoading(true)
        if (params.userId) {
            users.fetchById(params.userId).then((user) => {
                setUser(user)
                setLoading(false)
            })
        }
    }, [params.userId])

    if (!user) {
        return null
    }

    return (
        <ScrollArea scrollbars="y" onScrollCapture={() => { }} type="scroll" h='calc(100vh)' scrollbarSize={0}>
            <Stack
                align="center"
                w="100%"
                h="100%"
                mt={24}
                style={{ overflow: "hidden" }}
                gap={16}
            >
                <ProfileInfo user={user} />
                <ProfileArticles key={user.id} userId={user.id} />
            </Stack>
            <div style={{ height: 100 }} />
        </ScrollArea>
    )
});

export default ProfilePage
