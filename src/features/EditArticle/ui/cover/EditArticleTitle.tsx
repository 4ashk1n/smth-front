
import { Textarea } from "@mantine/core"
import { observer } from "mobx-react"
import { useEffect, useState } from "react"
import { useArticleStore } from "../../../../entities/article/contexts/article.context"
import InfoPopover from "../../../../shared/ui/popover/InfoPopover"

const EditArticleTitle: React.FC<{}> = observer(() => {

    const article = useArticleStore()
    const [opened, setOpened] = useState(false)

    const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        article.setTitle(e.target.value)
    }

    useEffect(() => {
        if (article.invalidFields.includes('title')) {
            setOpened(true)
        }
        else {
            setOpened(false)
        }
    }, [article.invalidFields])

    return (<>
        <InfoPopover level='error' message='Некорректный заголовок' opened={opened}>

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
        </InfoPopover>

    </>)
})

export default EditArticleTitle