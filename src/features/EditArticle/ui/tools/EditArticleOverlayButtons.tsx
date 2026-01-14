
import { Stack, Text } from "@mantine/core"
import { observer } from "mobx-react-lite"
import { PiImageSquareDuotone, PiLockSimpleDuotone, PiSelectionBackgroundDuotone, PiStarDuotone, PiTextAaDuotone } from "react-icons/pi"
import type { IconType } from "react-icons"
import { useArticleStore } from "../../../../entities/article/contexts/article.context"

const EditArticleActionButton: React.FC<{
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
    return (<>
        <EditArticleActionButton
            icon={article.content.dragMode ? PiLockSimpleDuotone : PiSelectionBackgroundDuotone}
            onClick={() => {article.content.setDragMode(!article.content.dragMode)}}
        />

        <EditArticleActionButton
            icon={PiStarDuotone}
            onClick={() => article.content.addEmptyBlock('icon')}
        />


        <EditArticleActionButton
            icon={PiImageSquareDuotone}
            onClick={() => article.content.addEmptyBlock('image')}
        />

        <EditArticleActionButton
            icon={PiTextAaDuotone}
            onClick={() => article.content.addEmptyBlock('paragraph')}
        />

        {/* <EditArticleActionButton
            icon={PiShareFatFill}
            onClick={() => { }}
        /> */}
    </>)
})

export default EditArticleOverlayButtons