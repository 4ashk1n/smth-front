import { Stack } from "@mantine/core";
import { useState } from "react";
import ProfileArticleTabs from "../../../features/ProfileArticlesTabs/ui";
import Grid3ColumnsVertical from "../../../shared/ui/grids/Grid3ColumnsVertical";
import type { ProfileTabs } from "../types/tabs.types";

const ProfileArticles = () => {
    const [openedTab, setOpenedTab] = useState<ProfileTabs>('articles');

    return (
        <Stack
            align="center"
            w="100%"
            gap={0}
        >
            <ProfileArticleTabs selectedTab={openedTab} setSelectedTab={setOpenedTab} />
            <Grid3ColumnsVertical isLoading> 
                <></>
            </Grid3ColumnsVertical>
        </Stack>
    )
}

export default ProfileArticles