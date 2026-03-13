import { Button, Loader, Modal, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { useArticleStore } from "../../../../entities/article/contexts/article.context";
import { useAuthStore } from "../../../../entities/user/contexts/auth.context";
import { getAISuggestions } from "../../api/getAISuggestions";
import { saveEditedArticle } from "../../api/saveEditedArticle";

type GetAISuggestionsButtonProps = {
  onSuggestionsSaved?: () => void;
};

const GetAISuggestionsButton = ({ onSuggestionsSaved }: GetAISuggestionsButtonProps) => {
  const article = useArticleStore();
  const auth = useAuthStore();
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);

  const handleGetSuggestions = async () => {
    if (loading || !auth.user || !article.id) return;

    open();
    setLoading(true);

    try {
      await saveEditedArticle(article);
      const response = await getAISuggestions(article.id, { mode: "all" });
      article.setAISuggestions(response.suggestions);
      console.log(article.aiSuggestions);
      close();
      onSuggestionsSaved?.();
    } catch (error) {
      console.error("Failed to get AI suggestions", error);
      close();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button size="sm" color={article.mainCategory.colors.accentColor} onClick={handleGetSuggestions}>
        Проверить с помощью ИИ
      </Button>

      <Modal
        opened={opened}
        radius={10}
        onClose={close}
        centered
        withCloseButton={false}
        closeOnClickOutside={false}
        closeOnEscape={false}
      >
        <Stack gap={8} align="center">
          <Text size="lg" fw={400}>
            Подбор ИИ-подсказок
          </Text>
          <Loader color="white" />
        </Stack>
      </Modal>
    </>
  );
};

export default GetAISuggestionsButton;
