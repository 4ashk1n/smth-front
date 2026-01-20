import { Textarea } from "@mantine/core"
import { observer } from "mobx-react"
import { useArticleStore } from "../../../../entities/article/contexts/article.context"
import type { Topic } from "../../../../entities/article/types/content.types"

const EditTopicHeader: React.FC<{ topic?: Topic }> = observer(({ topic }) => {
    const article = useArticleStore()
    const topicToRender = topic ?? article.content.currentTopic ?? article.content.topicsData[0]

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        article.content.editTopicTitle(topicToRender.id, event.target.value)
    }

    return (
        <Textarea
            autosize
            variant="unstyled"
            placeholder="Заголовок"
            // fw={700}
            lh={0.8}
            mt={10}
            fw={900} 
            onChange={handleChange}
            defaultValue={topicToRender.title}
            style={{
                fontVariantCaps: 'small-caps',
                // textShadow: `0 0px 16px ${article.mainCategory.colors.lightColor}40`
            }}
            styles={{
                input: {
                    color: article.mainCategory.colors.lightColor,
                    fontSize: 'clamp(24px, 7.5vw, 60px)',
                    lineHeight: 1
                }
            }}
            maxRows={3}
            maxLength={32}
        >
        </Textarea>
    )
})

export default EditTopicHeader