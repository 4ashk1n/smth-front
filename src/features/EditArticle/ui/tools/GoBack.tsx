import { Button, Modal, Stack } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { PiArrowArcLeft } from "react-icons/pi"
import { useArticleStore } from "../../../../entities/article/contexts/article.context"
import DeleteDraftButton from "./DeleteDraftButton"
import SaveDraftButton from "./SaveDraftButton"


export const GoBackModal = () => {
    const article = useArticleStore()
    const [opened, { open, close }] = useDisclosure(false);

    return (<>
        <Modal opened={opened} radius={10} onClose={close} variant="" title="Сохраните черновик" centered>
            <Stack gap={8}>
                <DeleteDraftButton />

                <SaveDraftButton />
                <Button size='sm' color={article.mainCategory.colors.accentColor} variant="default">
                    Отмена
                </Button>
            </Stack>
        </Modal>

        <Button size='xs' variant="light" color={article.mainCategory.colors.accentColor} onClick={open} leftSection={<PiArrowArcLeft size={16} />}>
            Назад
        </Button>
    </>)
}