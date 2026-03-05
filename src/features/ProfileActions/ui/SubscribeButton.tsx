import { Button } from "@mantine/core"
import type React from "react"
import { useAuthStore } from "../../../entities/user/contexts/auth.context"
import type { UserModel } from "../../../entities/user/models/user.model"

const SubscribeButton: React.FC<{
    user: UserModel
}> = ({user}) => {

    const authUser = useAuthStore()
    if (authUser.user && authUser.user.id === user.id) {
        return null;
    }

    return (
        <Button
            fz={16}
            p={0}
            size="lg"
            h={48}
            px={24}
            variant="white"
            c='black'
            radius={'xl'}
        >
            Подписаться
        </Button>
    )
}

export default SubscribeButton