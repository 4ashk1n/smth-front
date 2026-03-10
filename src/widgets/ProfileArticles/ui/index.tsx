import { Grid, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { ArticleMeta } from "../../../entities/article/types/article.types";
import ArticleCard from "../../../entities/article/ui/ArticleCard/ArticleCard";
import { getArticlesByTab } from "../../../features/UsersArticles/api/getArticlesByTab";
import ProfileArticleTabs from "../../../features/UsersArticles/ui/ProfileArticleTabs";
import Grid3ColumnsVertical from "../../../shared/ui/grids/Grid3ColumnsVertical";
import type { ProfileTabs } from "../types/tabs.types";

const ProfileArticles: React.FC<{ userId: string }> = ({ userId }) => {
    const [openedTab, setOpenedTab] = useState<ProfileTabs>('articles');
    const [isLoading, setIsLoading] = useState(false);
    const [articles, setArticles] = useState<ArticleMeta[]>([]);
    const navigate = useNavigate()

    useEffect(() => {
        setIsLoading(true);
        console.log(openedTab);
        (async () => {
            setArticles(await getArticlesByTab(userId, openedTab));
            setIsLoading(false);
        })();
    }, [openedTab])

    const handleCardClick = (articleId: string) => navigate(`/article/${articleId}`)

    return (
        <Stack
            align="center"
            w="100%"
            gap={0}
        >
            <ProfileArticleTabs userId={userId} selectedTab={openedTab} setSelectedTab={setOpenedTab} />
            <Grid3ColumnsVertical isLoading={isLoading}>
                {
                    articles.map((article, i) => (
                        <Grid.Col span={1} key={i} h={180} >
                            <ArticleCard variant="vertical" article={article} key={i} onClick={() => handleCardClick(article.id)} />
                        </Grid.Col>
                    ))
                }
            </Grid3ColumnsVertical>
        </Stack>
    )
}

export default ProfileArticles