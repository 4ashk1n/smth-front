import { Stack } from "@mantine/core"
import { observer } from "mobx-react"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { useUsersStore } from "../../../entities/user/contexts/users.context"
import type { UserModel } from "../../../entities/user/models/user.model"
import ProfileDescription from "../../../entities/user/ui/ProfileDescription"
import ProfileMetrics from "../../../entities/user/ui/ProfileMetrics"
import ProfileName from "../../../entities/user/ui/ProfileName"
import ProfilePhoto from "../../../entities/user/ui/ProfilePhoto"
import SubscribeButton from "../../../features/ProfileActions/ui/SubscribeButton"

const ProfileInfo = observer(() => {
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
})

export default ProfileInfo