import { ScrollArea, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { ArticleMeta } from "../../../entities/article/types/article.types";
import { useAuthStore } from "../../../entities/user/contexts/auth.context";
import CreateNewArticleButton from "../../../features/EditArticle/ui/tools/CreateNewArticleButton";
import { getArticlesByTab } from "../../../features/UsersArticles/api/getArticlesByTab";
import ArticlesListWithStatus from "../../../widgets/Workshop/ui/ArticlesListWithStatus";

export const WorkshopPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const auth = useAuthStore()
    const navigate = useNavigate()
    const [articles, setArticles] = useState<ArticleMeta[]>([]);

    useEffect(() => {
        if (!auth.user) return
        setIsLoading(true);
        (async () => {
            if (!auth.user) return
            setArticles(await getArticlesByTab(auth.user.id, 'reviews'));
            setIsLoading(false);
        })();
    }, [])

    if (auth.isBanned) {
        navigate('/banned')
        return null;
    }

    if (!auth.user) {
        navigate('/auth')
        return null;
    }

    const handleCardClick = (articleId: string) => navigate(`/article/${articleId}/edit`)

    return (
        <ScrollArea scrollbars="y" onScrollCapture={() => { }} type="scroll" h='calc(100vh)' scrollbarSize={0}>

            <Stack mt={24} gap={16}>
                <CreateNewArticleButton />
                <hr style={{ margin: '0 24px', opacity: 0.2 }} />
                <ArticlesListWithStatus status="review" articles={articles.filter(a => a.status === 'review')} loading={isLoading} onCardClick={handleCardClick} />
                <hr style={{ margin: '0 24px', opacity: 0.2 }} />
                <ArticlesListWithStatus status="draft" articles={articles.filter(a => a.status === 'draft')} loading={isLoading} onCardClick={handleCardClick} />
            </Stack>

            <div style={{ height: 100 }} />
        </ScrollArea>
    )
}
