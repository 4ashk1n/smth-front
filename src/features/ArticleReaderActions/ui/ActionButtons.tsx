
import { ActionIcon, Burger, NumberFormatter, Stack, Text } from "@mantine/core"
import { observer } from "mobx-react-lite"
import { PiBookmarkSimpleFill, PiChatCenteredDotsFill, PiHeartFill, PiShareFatFill } from "react-icons/pi"

const ArticleActionButtons: React.FC<{
    counter: number,
    pressed: boolean,
    icon: React.ReactNode,
    onClick: () => void
}> = observer((props) => {

    return (
        <Stack
            w='fit-content'
            justify="center"
            gap={2}
        >
            <ActionIcon size={'md'} variant="transparent" c='white'>
                {props.icon}
            </ActionIcon>

            <Text
                size="12px"
                c='white'
                style={{textAlign: 'center'}}
            >
                {/* <NumberFormatter> */}
                    {props.counter}
                {/* </NumberFormatter> */}
            </Text>
        </Stack>
    )
})

const ActionButtons: React.FC<{}> = observer(() => {
    return (<>
        <Stack
            w='fit-content'
            h='fit-content'
            pos={'absolute'}
            justify="center"
            right={8}
            bottom={8}
            gap={24}
        >

            <ArticleActionButtons
                counter={0}
                pressed={false}
                icon={<PiHeartFill  size={30} />}
                onClick={() => { }}
            />


            <ArticleActionButtons
                counter={0}
                pressed={false}
                icon={<PiChatCenteredDotsFill size={30}  />}
                onClick={() => { }}
            />

            <ArticleActionButtons
                counter={0}
                pressed={false}
                icon={<PiBookmarkSimpleFill size={30} />}
                onClick={() => { }}
            />

            <ArticleActionButtons
                counter={0}
                pressed={false}
                icon={<PiShareFatFill  size={30} />}
                onClick={() => { }}
            />

            <Burger size={'40px'} />
        </Stack>
    </>)
})

export default ActionButtons