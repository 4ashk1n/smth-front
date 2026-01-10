
import { Textarea } from "@mantine/core"
import { observer } from "mobx-react-lite"
import { useArticleStore } from "../../../../entities/article/contexts/article.context"

const EditArticleDescription: React.FC<{}> = observer(() => {
    const article = useArticleStore()

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        article.setDescription(event.target.value)
    }

    return (<>
        <Textarea
            fw={200}
            variant="unstyled"
            style={{
                overflow: 'visible'
            }}
            placeholder="Описание"
            styles={{
                input: {
                    border: 0,
                    fontSize: '24px',
                    color: `${article.mainCategory.colors.lightColor}`,
                    textShadow: '0 4px 4px rgba(0, 0, 0, 0.25)',
                    height: 'fit-content',
                    lineHeight: 1,
                    padding: 0
                },
            }}
            w='100%'
            maxLength={48}
            rows={2}
            onChange={handleDescriptionChange}
            defaultValue={article.description}
        />

    </>)
})

export default EditArticleDescription