import type { AiSuggestion } from "@smth/shared";
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

const MODERATION_SOURCE = "moderation-remark";

function keepModerationSuggestions(suggestions: AiSuggestion[]): AiSuggestion[] {
  return suggestions.filter((suggestion) => {
    const meta = suggestion.meta as Record<string, unknown> | undefined;
    return meta?.source === MODERATION_SOURCE;
  });
}

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
      const moderationSuggestions = keepModerationSuggestions(article.aiSuggestions);
      article.setAISuggestions([...moderationSuggestions, ...response.suggestions]);
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
