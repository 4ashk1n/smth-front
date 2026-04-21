import { Button } from "@mantine/core"
import type React from "react"
import { PiGear } from "react-icons/pi"
import { useNavigate } from "react-router"
import { useAuthStore } from "../../../entities/user/contexts/auth.context"
import type { UserModel } from "../../../entities/user/models/user.model"

const SettingsButton: React.FC<{
    user: UserModel
}> = ({ user }) => {

    const authUser = useAuthStore()
    if (authUser.user && authUser.user.id !== user.id) {
        return null;
    }

    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/profile/${user.id}/settings`)
    }

    return (
        <Button
            fz={16}
            p={0}
            size="lg"
            h={48}
            px={24}
            variant="white"
            c={'white'}
            leftSection={<PiGear size={20} />}
            bg={'black'}
            style={{ border: '1px solid #808080' }}
            radius={'xl'}
            color="black"
            onClick={handleClick}
        >
            Настройки
        </Button>
    )
}

export default SettingsButton