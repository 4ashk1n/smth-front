import { Center, Stack } from "@mantine/core";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { useAuthStore } from "../../../entities/user/contexts/auth.context";
import AuthWidget from "../../../widgets/AuthWidget/ui";
import ProfileArticles from "../../../widgets/ProfileArticles/ui";
import ProfileInfo from "../../../widgets/ProfileInfo/ui";

const ProfilePage = observer(() => {
    const auth = useAuthStore();

    useEffect(() => {
        if (!auth.isAuthenticated) {
            auth.openDrawer();
        }
    }, [auth.isAuthenticated]);

    if (!auth.user || !auth.isAuthenticated) {
        console.log(auth.user, auth.isAuthenticated)
        return <>
            <Center w='100%' h='calc(100% - 80px)'><AuthWidget /></Center>
        </>;
    }

    return (
        <Stack
            align="center"
            w="100%"
            h="100%"
            mt={24}
            style={{ overflow: "hidden" }}
            gap={16}
        >
            <ProfileInfo />
            <ProfileArticles userId={auth.user.id} />
        </Stack>
    )
});

export default ProfilePage