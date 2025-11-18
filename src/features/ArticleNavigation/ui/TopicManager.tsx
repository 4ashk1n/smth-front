import { Group, ScrollArea, Stack, Text } from "@mantine/core"
import { useArticleStore } from "../../../entities/article/contexts/article.context"
import { observer } from "mobx-react-lite"
import { useMemo } from "react"
import type { Topic } from "../../../entities/article/types/content.types"

const TopicItem: React.FC<{
    topic: Topic,
    topicsLength: number
}> = observer(({ topic, topicsLength }) => {
    const article = useArticleStore()

    const currentTopic = useMemo(() => article.content.currentTopic, [article.content.currentTopicId])
    const distanceToCurrentTopic = useMemo(() => article.content.distanceToCurrentTopic(topic.order), [article.content.currentTopicId, topic])
    const gradientColors = useMemo(() => {
        return [
            article.content.distanceToCurrentTopic(topic.order - 0.5),
            distanceToCurrentTopic,
            article.content.distanceToCurrentTopic(topic.order + 0.5)
        ].map((d, i) => `${article.mainCategory.colors.accentColor}${Math.round(d * 255 * 0.8).toString(16).padStart(2, '0')} ${i * 50}%`).join(', ')
    }, [article.content.currentTopicId, topic])

    return (<>

        <Group h='100%' wrap="nowrap" pos='relative'>
            <div
                style={{
                    minWidth: '3px',
                    height: '-webkit-fill-available',
                    background: `linear-gradient(
                        180deg, 
                        ${gradientColors}
                    )`,
                }}
            />
            <Text
                c={article.mainCategory.colors.accentColor}
                fw={currentTopic?.id == topic.id ? 500 : 300}
                fz={currentTopic?.id == topic.id ? 20 : Math.max(12, (20 * (distanceToCurrentTopic)))}
                opacity={currentTopic?.id === topic.id ? 1 : distanceToCurrentTopic * 0.8}
                lh={1}
                p={5}
                h='100%'
                style={{
                    cursor: 'pointer',
                }}
                className={`
                    hover:opacity-100!
                    transition ease-in-out duration-100
                `}
                onClick={() => article.content.changeTopic(topic.id)}
            >
                {topic.title}
            </Text>
        </Group>

    </>)
})

const TopicsList = observer(() => {
    const article = useArticleStore()
    const topics = useMemo(() => article.content.topicsData, [article.content.topics])
    return (<>
        {/* <div
            style={{
                mask: 'linear-gradient(0deg, #00000000 0%, #000000 100%)',
                WebkitMask: 'linear-gradient(0deg, #00000000 0%, #000000 100%)',
                backdropFilter: 'blur(1px)',
                background: 'rgba(0, 0, 0, 0.2)',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 2,
            }}
        /> */}


        <ScrollArea h='100%' scrollbarSize={0}>
            <Stack gap={0} w='100%' h='100%' style={{ overflow: 'hidden' }} p={0} m={0} >
                {
                    topics.map((t, i) => (<>
                        <TopicItem key={i} topic={t} topicsLength={topics.length} />
                    </>))
                }
            </Stack>
        </ScrollArea>

    </>)
})

export default TopicsList