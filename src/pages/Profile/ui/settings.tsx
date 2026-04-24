import { Button, Group, ScrollArea, Stack, Title } from "@mantine/core";
import { useState } from "react";
import { PiArrowArcLeft, PiFloppyDiskDuotone } from "react-icons/pi";
import { useNavigate, useParams } from "react-router";
import ProfileSettings, { type ProfileSettingsActions, type ProfileSettingsState } from "../../../widgets/ProfileSettings";

const ProfileSettingsPage = () => {
    const params = useParams();
    const navigate = useNavigate();

    const [sectionState, setSectionState] = useState<ProfileSettingsState>({
        isDirty: false,
        isSaving: false,
        canSubmit: false,
    });

    const [sectionActions, setSectionActions] = useState<ProfileSettingsActions | null>(null);
    const saveDisabled = !sectionState.isDirty || sectionState.isSaving || !sectionState.canSubmit;

    return (
        <>
            <Group
                justify="space-between"
                w="100%"
                px={16}
                py={12}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    zIndex: 1000,
                    backdropFilter: "blur(10px)",
                    background: "rgba(0, 0, 0, 0.35)",
                }}
            >
                <Button
                    variant="white"
                    c="white"
                    bg="black"
                    style={{ border: "1px solid #808080" }}
                    radius="xl"
                    leftSection={<PiArrowArcLeft size={16} />}
                    onClick={() => navigate(`/profile/${params.userId}`)}
                >
                    Назад
                </Button>

                <Button
                    variant="white"
                    radius="xl"
                    leftSection={<PiFloppyDiskDuotone size={16} />}
                    c={saveDisabled ? "white" : "black"}
                    bg={saveDisabled ? "black" : "white"}
                    style={{ border: saveDisabled ? "1px solid #808080" : "none" }}
                    disabled={saveDisabled}
                    loading={sectionState.isSaving}
                    onClick={() => sectionActions?.submit()}
                >
                    Сохранить
                </Button>
            </Group>

            <ScrollArea scrollbars="y" type="scroll" h="calc(100vh)" scrollbarSize={0}>
                <Stack w="100%" mt={76} px={16} pb={110} gap={16}>
                    <Stack gap={4} maw={760} w="100%" mx="auto">
                        <Title order={2} fz={24} c="white">
                            Настройки
                        </Title>
                    </Stack>

                    <hr style={{ margin: "0 auto", opacity: 0.2, width: "100%", maxWidth: 760 }} />

                    <Stack gap={10} maw={760} w="100%" mx="auto">
                        <Title order={3} fz={18}>
                            Информация
                        </Title>

                        <ProfileSettings
                            userId={params.userId}
                            onStateChange={setSectionState}
                            onRegisterActions={setSectionActions}
                        />
                    </Stack>
                </Stack>
            </ScrollArea>
        </>
    );
};

export default ProfileSettingsPage;
