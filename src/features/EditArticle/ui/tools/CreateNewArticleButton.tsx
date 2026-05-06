import { Button, Loader, Modal, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { PiPlusBold } from "react-icons/pi";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../../../entities/user/contexts/auth.context";
import { createNewArticle } from "../../api/createNewArticle";

const CreateNewArticleButton: React.FC<{}> = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const auth = useAuthStore()
    const navigate = useNavigate()


    const handleCreate = () => {
        if (!auth.user) return
        open();
        createNewArticle(auth.user.id).then((articleId) => {
            navigate(`/article/${articleId}/edit`)
            close();
        })
    }

    return (<>
        <Stack px={16}>
            <Button size='xl' variant="outline" style={{ borderStyle: 'dashed' }} onClick={handleCreate} radius={10} leftSection={<PiPlusBold size={20} />} color='white'>
                <Text lh={1} size={'lg'} fw={700}>Новая статья</Text>
            </Button>
        </Stack>

        <Modal opened={opened} radius={10} onClose={close} variant="" centered withCloseButton={false} closeOnClickOutside={false} closeOnEscape={false}>
            <Stack gap={8} align="center">
                <Text size={'lg'} fw={400}>Создание статьи</Text>
            <Loader color='white'/>
            </Stack>
        </Modal>
    </>)
}

export default CreateNewArticleButton