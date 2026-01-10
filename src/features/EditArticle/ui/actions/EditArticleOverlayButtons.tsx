
import { Stack, Text } from "@mantine/core"
import { observer } from "mobx-react-lite"
import { PiBookmarkSimpleFill, PiChatCenteredDotsFill, PiHeartFill, PiImageSquare, PiImageSquareDuotone, PiParagraph, PiShareFatFill, PiStar, PiStarDuotone, PiTextAa, PiTextAaDuotone } from "react-icons/pi"
import type { IconType } from "react-icons"
import { FaIcons } from "react-icons/fa6"

const EditArticleActionButton: React.FC<{
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
                &nbsp;
            </Text>
        </Stack>
    )
})

const EditArticleOverlayButtons: React.FC<{}> = observer(() => {
    return (<>
        <EditArticleActionButton
            icon={PiStarDuotone}
            onClick={() => { }}
        />


        <EditArticleActionButton
            icon={PiImageSquareDuotone}
            onClick={() => { }}
        />

        <EditArticleActionButton
            icon={PiTextAaDuotone}
            onClick={() => { }}
        />

        {/* <EditArticleActionButton
            icon={PiShareFatFill}
            onClick={() => { }}
        /> */}
    </>)
})

export default EditArticleOverlayButtons