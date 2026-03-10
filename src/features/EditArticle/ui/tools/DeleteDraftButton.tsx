import { Button, Modal, Stack, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { useState } from "react"
import { useNavigate } from "react-router"
import { useArticleStore } from "../../../../entities/article/contexts/article.context"
import { useAuthStore } from "../../../../entities/user/contexts/auth.context"
import { deleteArticle } from "../../api/deleteArticle"

const DeleteDraftButton = () => {
    const article = useArticleStore()
    const auth = useAuthStore()
    const [loading, setLoading] = useState(false)
    const [opened, { open, close }] = useDisclosure(false);
    const navigate = useNavigate()

    const handleDelete = async () => {
        if (loading) return
        if (!auth.user) return
        setLoading(true)
        try {
            deleteArticle(article).then(() => {
                setLoading(false)
                navigate('/workshop')
            })
        } catch (error) {
            console.error("Failed to save article", error)
        } finally {
            setLoading(false)
        }
    }

    const DeleteButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (<Button size='sm' color={'red'} onClick={onClick} variant="filled">Удалить</Button>)

    return (<>
        <Modal opened={opened} radius={10} onClose={close} color="red"  centered withCloseButton={false}>
            <Stack gap={8}>
                <Text size={'lg'} style={{textAlign: 'center', textWrap: 'balance'}}>Вы уверены, что хотите удалить черновик?</Text>
                <DeleteButton onClick={handleDelete} />
                <Button size='sm' color={article.mainCategory.colors.accentColor} onClick={close} variant="default">
                    Отмена
                </Button>
            </Stack>
        </Modal>

        <DeleteButton onClick={open} />
    </>)
}

export default DeleteDraftButton
