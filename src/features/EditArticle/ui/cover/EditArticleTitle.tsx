
import { Textarea } from "@mantine/core"
import { observer } from "mobx-react-lite"
import { useArticleStore } from "../../../../entities/article/contexts/article.context"

const EditArticleTitle: React.FC<{}> = observer(() => {

    const article = useArticleStore()

    const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        article.setTitle(e.target.value)
    }

    return (<>
        <Textarea
            fw={900}
            variant="unstyled"
            style={{
                fontVariantCaps: 'small-caps',
                overflow: 'visible'
            }}
            placeholder="Название"
            styles={{
                input: {
                    border: 0,
                    fontSize: '48px',
                    color: `${article.mainCategory.colors.lightColor}`,
                    textShadow: '0 4px 4px rgba(0, 0, 0, 0.25)',
                    outlineOffset: -8,
                    height: 'fit-content',
                    lineHeight: 1,
                    padding: 0
                },
            }}
            maxLength={20}
            rows={1}
            onChange={handleTitleChange}
            defaultValue={article.title}
        />

    </>)
})

export default EditArticleTitle