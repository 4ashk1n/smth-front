import { Button } from "@mantine/core"
import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { useAuthStore } from "../../../entities/user/contexts/auth.context"
import { useUsersStore } from "../../../entities/user/contexts/users.context"
import type { UserModel } from "../../../entities/user/models/user.model"

const SubscribeButton: React.FC<{
    user: UserModel
}> = ({ user }) => {

    const authUser = useAuthStore()
    if (authUser.user && authUser.user.id === user.id) {
        return null;
    }

    const [subscribed, setSubscribed] = useState(false)
    const [loading, setLoading] = useState(true)
    const users = useUsersStore()

    const navigate = useNavigate()

    useEffect(() => {
        (async () => {
            setLoading(true)
            if (authUser.user) {
                const me = await users.fetchById(authUser.user.id);
                if (!me) {
                    setLoading(false)
                    return
                }
                me.isSubscribedTo(user.id).then((isSubscribed) => {
                    setSubscribed(isSubscribed)
                    setLoading(false)
                })
            }
            setLoading(false)
        })()
    }, [authUser.user, user.id])

    const handleClick = () => {
        if (loading) return;
        if (!authUser.user) {
            navigate('/auth')
            return;
        }

        setLoading(true)

        users.fetchById(authUser.user.id).then((me) => {
            if (!me) {
                setLoading(false)
                return
            }
            if (subscribed) {
                me.unsubscribeFrom(user.id).then(() => {
                    setSubscribed(false)
                    user.changeMetrics({
                        followers: user.metrics.followers - 1
                    })
                    setLoading(false)

                })
            }
            else {
                me.subscribeTo(user.id).then(() => {
                    setSubscribed(true)
                    user.changeMetrics({
                        followers: user.metrics.followers + 1
                    })
                    setLoading(false)
                })
            }
        });
    }

    return (
        <Button
            fz={16}
            p={0}
            size="lg"
            h={48}
            px={24}
            variant="white"
            c={subscribed ? 'white' :'black'}
            bg={subscribed ? 'black' : 'white'}
            style={{ border: subscribed ? '1px solid #808080' : 'none' }}
            radius={'xl'}
            loading={loading}
            color="black"
            onClick={handleClick}
        >
            {
                subscribed ? 'Отписаться' : 'Подписаться'
            }
        </Button>
    )
}

export default SubscribeButton