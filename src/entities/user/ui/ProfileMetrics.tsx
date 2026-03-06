import { Group, Skeleton, Stack, Text } from "@mantine/core"
import type { UserMetrics } from "@smth/shared"
import { observer } from "mobx-react"
import { useEffect, useState } from "react"
import { formatNumber } from "../../../shared/lib/formatNumber"
import type { UserModel } from "../models/user.model"

const ProfileStatsItem: React.FC<{ title: string, value: number, loading: boolean }> = ({
    title,
    value,
    loading
}) => {
    return (
        <Stack gap={4} align="center" w={'100%'}>
            <Skeleton visible={loading} radius={5} w='fit-content' >
                <Text
                    fz={16}
                    fw={600}
                    lh={1}
                    c='white'
                >
                    {formatNumber(value)}
                </Text>
            </Skeleton>

            <Text
                fz={12}
                lh={1}
                fw={400}
                c='white'
                opacity={0.5}
            >
                {title}
            </Text>
        </Stack>
    )
}

const Separator = () => {
    return <div style={{ width: 2, height: 2, background: 'white', opacity: 0.25 }} />
}

const ProfileMetrics: React.FC<{
    user: UserModel
}> = observer(({ user }) => {

    const [metrics, setMetrics] = useState<UserMetrics>({ // 100 for skeleton width
        articles: 100,
        followers: 100,
        following: 100
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        user.fetchMetrics().then(() => {
            setLoading(false)
        })
    }, [user])

    useEffect(() => {
        console.log(user.metrics)
        setMetrics(user.metrics)
    }, [user.metrics.articles, user.metrics.followers, user.metrics.following])

    return (
        <Group gap={12} wrap="nowrap">
            <ProfileStatsItem title="Публикации" value={metrics.articles} loading={loading} />
            <Separator />
            <ProfileStatsItem title="Подписчиков" value={metrics.followers} loading={loading} />
            <Separator />
            <ProfileStatsItem title="Подписок" value={metrics.following} loading={loading} />
        </Group>
    )
})

export default ProfileMetrics
