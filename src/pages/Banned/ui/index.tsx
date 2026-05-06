import { Button, Center, Paper, Stack, Text, Title } from "@mantine/core";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../../entities/user/contexts/auth.context";

const BannedPage: React.FC = observer(() => {
  const auth = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isBanned) {
      navigate("/auth", { replace: true });
    }
  }, [auth.isBanned, navigate]);

  if (!auth.isBanned) {
    return null;
  }

  return (
    <Center w="100%" h="calc(100vh - 80px)" px={16}>
      <Paper w="100%" maw={540} p={24} radius="lg" withBorder>
        <Stack gap={14}>
          <Title order={2}>Аккаунт заблокирован</Title>
          <Text c="dimmed">
            Ваш аккаунт забанен. Доступ к созданию контента и действиям в профиле ограничен.
          </Text>
          <Button
            color="red"
            variant="filled"
            onClick={() => void auth.logoutRequest()}
            mt={6}
          >
            Выйти
          </Button>
        </Stack>
      </Paper>
    </Center>
  );
});

export default BannedPage;
