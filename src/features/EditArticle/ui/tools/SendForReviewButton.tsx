import { Button, Modal, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { PiArrowRight } from "react-icons/pi";
import { useNavigate } from "react-router";
import { useArticleStore } from "../../../../entities/article/contexts/article.context";
import { useAuthStore } from "../../../../entities/user/contexts/auth.context";
import { getInvalidFields, sendArticleForReview } from "../../api/sendArticleForReview";
import GetAISuggestionsButton from "./GetAISuggestionsButton";

const SendForReviewButton = () => {
    const article = useArticleStore();
    const auth = useAuthStore();
    const [isSaving, setIsSaving] = useState(false);
    const [invalidFields, setInvalidFields] = useState<string[]>([]);

    const [opened, { open, close }] = useDisclosure(false);
    const navigate = useNavigate()

    const handleValidate = async () => {
        if (isSaving || !auth.user) return;

        setIsSaving(true);
        setInvalidFields([]);

        try {
            article.setAuthorId(auth.user.id);

            const invalidFields = getInvalidFields(article);
            if (invalidFields.length) {
                setInvalidFields(invalidFields);
                article.setInvalidFields(invalidFields);
                article.content?.changePage("cover");
            }
            else {
                open()
            }
        } catch (error) {
            console.error("Failed to validate article for review", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSend = async () => {
        if (isSaving) return
        if (!auth.user) return
        setIsSaving(true)
        try {
            await sendArticleForReview(article)
            setIsSaving(false)
            navigate('/workshop')
        } catch (error) {
            console.error("Failed to send article for review", error)
        } finally {
            setIsSaving(false)
        }
    }

    const SendButton = ({ onClick, size }: { onClick: () => void, size?: string }) => (
        <Button size={size} bg={article.mainCategory.colors.accentColor} onClick={onClick} variant="filled" loading={isSaving} rightSection={<PiArrowRight size={16} />}>
            На проверку
        </Button>
    )

    return (
        <>
            <Modal opened={opened} radius={10} onClose={close} withCloseButton={false} centered>
                <Stack gap={8}>
                    <Text size={'lg'} style={{ textAlign: 'center', textWrap: 'pretty' }}>Вы уверены, что хотите отправить статью на модерацию?</Text>
                    <GetAISuggestionsButton onSuggestionsSaved={close} />
                    <SendButton size='sm' onClick={handleSend} />
                    <Button size='sm' onClick={close} variant="default">
                        Отмена
                    </Button>
                </Stack>
            </Modal>

            <SendButton size='xs' onClick={handleValidate} />
        </>
    );
};

export default SendForReviewButton;
