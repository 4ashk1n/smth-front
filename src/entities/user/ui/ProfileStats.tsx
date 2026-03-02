import { Group, Stack, Text } from "@mantine/core"
import { formatNumber } from "../../../shared/lib/formatNumber"

const ProfileStatsItem: React.FC<{ title: string, value: number }> = ({
    title,
    value
}) => {
    return (
        <Stack gap={4} align="center" w={'100%'}>
            <Text
                fz={16}
                fw={600}
                lh={1}
                c='white'
            >
                {formatNumber(value)}
            </Text>

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

const ProfileStats = () => {
    return (
        <Group gap={12} wrap="nowrap">
            <ProfileStatsItem title="Публикации" value={1000} />
            <Separator />
            <ProfileStatsItem title="Подписчиков" value={10000} />
            <Separator />
            <ProfileStatsItem title="Подписок" value={166666660} />
        </Group>
    )
}

export default ProfileStats