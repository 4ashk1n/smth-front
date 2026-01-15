
import { ActionIcon, Burger, NumberFormatter, Stack, Text, Transition } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { observer } from "mobx-react"
import { PiBookmarkSimpleFill, PiChatCenteredDotsFill, PiHeartFill, PiShareFatFill } from "react-icons/pi"
import { useArticleStore } from "../../../entities/article/contexts/article.context"
import type { IconType } from "react-icons"

const ArticleActionButton: React.FC<{
    counter: number,
    pressed: boolean,
    icon: IconType,
    onClick: () => void
}> = observer((props) => {

    return (
        <Stack
            w='fit-content'
            justify="center"
            gap={2}
        >
            <props.icon size={30} color="white" />
            <Text
                size="12px"
                c='white'
                style={{ textAlign: 'center' }}
            >
                {/* <NumberFormatter> */}
                {props.counter}
                {/* </NumberFormatter> */}
            </Text>
        </Stack>
    )
})

const ActionButtons: React.FC<{}> = observer(() => {
    const article = useArticleStore()
    const [opened, { toggle }] = useDisclosure();
    return (<>
        <ArticleActionButton
            counter={0}
            pressed={false}
            icon={PiHeartFill}
            onClick={() => { }}
        />

        <ArticleActionButton
            counter={0}
            pressed={false}
            icon={PiChatCenteredDotsFill}
            onClick={() => { }}
        />

        <ArticleActionButton
            counter={0}
            pressed={false}
            icon={PiBookmarkSimpleFill}
            onClick={() => { }}
        />

        <ArticleActionButton
            counter={0}
            pressed={false}
            icon={PiShareFatFill}
            onClick={() => { }}
        />
    </>)
})

export default ActionButtons