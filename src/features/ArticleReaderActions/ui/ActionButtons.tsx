
import { Stack, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { observer } from "mobx-react"
import { useEffect } from "react"
import type { IconType } from "react-icons"
import { PiBookmarkSimpleFill, PiChatCenteredDotsFill, PiHeartFill, PiShareFatFill } from "react-icons/pi"
import { useArticleStore } from "../../../entities/article/contexts/article.context"
import { useAuthStore } from "../../../entities/user/contexts/auth.context"
import { formatNumber } from "../../../shared/lib/formatNumber"
import ArticleCommentsDrawer from "../../ArticleComments/ui/ArticleCommentsDrawer"
import { likeArticle } from "../api/likeArticle"
import { repostArticle } from "../api/repostArticle"
import { saveArticle } from "../api/saveArticle"

const ArticleActionButton: React.FC<{
    counter: number,
    pressed: boolean,
    pressedColor: string,
    icon: IconType,
    onClick: () => void
}> = observer((props) => {

    return (
        <Stack
            w='fit-content'
            justify="center"
            gap={2}
            onClick={props.onClick}
        >
            <props.icon size={30} color={props.pressed ? props.pressedColor : 'white'} />
            <Text
                size="12px"
                c='white'
                style={{ textAlign: 'center' }}
            >
                {formatNumber(props.counter)}
            </Text>
        </Stack>
    )
})

const ActionButtons: React.FC<{}> = observer(() => {
    const article = useArticleStore()
    const auth = useAuthStore()
    const [commentsOpened, { open: openComments, close: closeComments }] = useDisclosure(false);

    useEffect(() => {
        article.fetchMetrics().catch(() => {})
    }, [article])

    return (<>
        <ArticleActionButton
            counter={article.metrics.likes}
            pressed={article.metrics.liked}
            pressedColor="red"
            icon={PiHeartFill}
            onClick={() => likeArticle(article, auth.user?.id || '') }
        />

        <ArticleActionButton
            counter={article.metrics.comments}
            pressedColor="white"
            pressed={commentsOpened}
            icon={PiChatCenteredDotsFill}
            onClick={openComments}
        />

        <ArticleActionButton
            counter={article.metrics.saves}
            pressedColor="yellow"
            pressed={article.metrics.saved}
            icon={PiBookmarkSimpleFill}
            onClick={() => saveArticle(article, auth.user?.id || "")}
        />

        <ArticleActionButton
            counter={article.metrics.reposts}
            pressed={article.metrics.reposted}
            pressedColor="blue"
            icon={PiShareFatFill}
            onClick={() => repostArticle(article, auth.user?.id || "")}
        />

        <ArticleCommentsDrawer
            opened={commentsOpened}
            articleId={article.id}
            commentsCount={article.metrics.comments}
            currentUserId={auth.user?.id}
            onClose={closeComments}
            onCommentsCountChange={(count) => {
                article.updateMetrics({ comments: count })
            }}
        />
    </>)
})

export default ActionButtons
