import { Button } from "@mantine/core"
import { useState } from "react"
import { PiArrowRightBold } from "react-icons/pi"
import { useArticleStore } from "../../../../entities/article/contexts/article.context"
import { useAuthStore } from "../../../../entities/user/contexts/auth.context"
import { createNewArticle } from "../../api/createNewArticle"
import { saveEditedArticle } from "../../api/saveEditedArticle"

const SendForReviewButton = () => {
    const article = useArticleStore()
    const auth = useAuthStore()
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        if (isSaving) return
        if (!auth.user) return
        setIsSaving(true)
        try {
            article.setAuthorId(auth.user.id)
            if (window.location.pathname.includes('/edit')) {
                await saveEditedArticle(article)
            } else if (window.location.pathname.includes('/new')) {
                await createNewArticle(article)
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
            rightSection={<PiArrowRightBold size={16} />}
        >
            На проверку
        </Button>
    </>)
}

export default SendForReviewButton
