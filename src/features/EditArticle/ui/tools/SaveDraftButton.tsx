import { Button } from "@mantine/core"
import { useState } from "react"
import { useNavigate } from "react-router"
import { useArticleStore } from "../../../../entities/article/contexts/article.context"
import { useAuthStore } from "../../../../entities/user/contexts/auth.context"
import { saveEditedArticle } from "../../api/saveEditedArticle"

const SaveDraftButton = () => {
    const article = useArticleStore()
    const auth = useAuthStore()
    const [isSaving, setIsSaving] = useState(false)
    const navigate = useNavigate()

    const handleSave = async () => {
        if (isSaving) return
        if (!auth.user) return
        setIsSaving(true)
        try {
            await saveEditedArticle(article)
            setIsSaving(false)
            navigate('/workshop')
        } catch (error) {
            console.error("Failed to save article", error)
        } finally {
            setIsSaving(false)
        }
    }

    return (<>
        <Button
            size='sm'
            variant="default"
            onClick={handleSave}
            loading={isSaving}
        >
            Сохранить
        </Button>
    </>)
}

export default SaveDraftButton
