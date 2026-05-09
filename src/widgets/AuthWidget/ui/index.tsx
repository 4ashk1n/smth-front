import { ActionIcon, Group, Stack, Title } from "@mantine/core";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { FaGoogle, FaTiktok, FaYandex } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../../entities/user/contexts/auth.context";

const AuthWidget: React.FC<{}> = observer(() => {
    const auth = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.isBanned) {
            navigate("/banned", { replace: true });
        }
    }, [auth.isBanned, navigate]);

    const handleGoogleLogin = () => {
        auth.startGoogleOAuth(window.location.pathname);
    };

    const handleTikTokLogin = () => {
        auth.startTikTokOAuth(window.location.pathname);
    };

    const handleYandexLogin = () => {
        auth.startYandexOAuth(window.location.pathname);
    };

    return (
        <Stack w='100%' p={16} h='100%' align="center" justify="center">
            <Title order={1} c='white'>Вход</Title>
            <Group gap={8} w={'100%'} justify="center">
                <ActionIcon size="xl" variant="white" radius={10} c='black' onClick={handleGoogleLogin}>
                    <FaGoogle size={20} />
                </ActionIcon>

                <ActionIcon size="xl" variant="white" radius={10} c='black' onClick={handleYandexLogin}>
                    <FaYandex size={20} />
                </ActionIcon>

                <ActionIcon size="xl" variant="white" radius={10} c='black' onClick={handleTikTokLogin}>
                    <FaTiktok size={20} />
                </ActionIcon>

            </Group>

        </Stack>
    );
});

export default AuthWidget;
