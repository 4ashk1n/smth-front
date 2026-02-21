import { Button } from "@mantine/core"
import { useState } from "react"
import { useArticleStore } from "../../../../entities/article/contexts/article.context"
import { saveEditedArticle } from "../../api/saveEditedArticle"
import { saveNewArticle } from "../../api/saveNewArticle"

const SaveButton = () => {
    const article = useArticleStore()
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        if (isSaving) return
        setIsSaving(true)
        try {
            if (window.location.pathname.includes('/edit')) {
                await saveEditedArticle(article)
            } else if (window.location.pathname.includes('/new')) {
                await saveNewArticle(article)
            }
        } catch (error) {
            console.error("Failed to save article", error)
        } finally {
            setIsSaving(false)
        }
    }

    return (<>
        <Button
            size='xs'
            color={article.mainCategory.colors.accentColor}
            onClick={handleSave}
            loading={isSaving}
        >
            Сохранить
        </Button>
    </>)
}

export default SaveButton
