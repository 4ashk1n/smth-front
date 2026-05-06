
import { Stack, Text } from "@mantine/core"
import { observer } from "mobx-react"
import type { IconType } from "react-icons"
import { PiImageSquareDuotone, PiLockSimpleDuotone, PiSelectionBackgroundDuotone, PiStarDuotone, PiTextAaDuotone } from "react-icons/pi"
import { useArticleStore } from "../../../../entities/article/contexts/article.context"

const EditArticleActionButton: React.FC<{
    icon: IconType,
    onClick: () => void,
    active: boolean
}> = observer((props) => {

    return (
        <Stack
            w='fit-content'
            justify="center"
            gap={2}
            onClick={props.active ? props.onClick : undefined}
            opacity={0.5 + +props.active * 0.5}
        >
            <props.icon size={30} color="white" />
            <Text
                size="12px"
                c='white'
                style={{ textAlign: 'center' }}
            >
                &nbsp;
            </Text>
        </Stack>
    )
})

const EditArticleOverlayButtons: React.FC<{}> = observer(() => {
    const article = useArticleStore();
    if (!article.content) return null
    return (<>
        <EditArticleActionButton
            active={article.content.currentPage?.blocks.length !== 0}
            icon={article.content.dragMode ? PiLockSimpleDuotone : PiSelectionBackgroundDuotone}
            onClick={() => {article.content && article.content.setDragMode(!article.content.dragMode)}}
        />

        <EditArticleActionButton
            active
            icon={PiStarDuotone}
            onClick={() => article.content && article.content.addEmptyBlock('icon')}
        />


        <EditArticleActionButton
            active
            icon={PiImageSquareDuotone}
            onClick={() => article.content && article.content.addEmptyBlock('image')}
        />

        <EditArticleActionButton
            active
            icon={PiTextAaDuotone}
            onClick={() => article.content && article.content.addEmptyBlock('paragraph')}
        />
    </>)
})

export default EditArticleOverlayButtons