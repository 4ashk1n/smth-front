import { useContext, useState } from "react"
import type { Icon } from "../../../../entities/article/types/blocks/Icon"
import { observer } from "mobx-react-lite"
import ReactIcon, { type IconName } from "../../../../shared/icon/ReactIcon"
import { FaIcons } from "react-icons/fa6"
import { Stack, Text } from "@mantine/core"
import { ArticleContext } from "../../../stores/ArticleStore"

const IconBlockEdit: React.FC<{
    block: Icon
}> = observer((props) => {
    const [block, setBlock] = useState(props.block)
    const { editBlock, categoryColors } = useContext(ArticleContext)

    return (<>
        {
            block.name ?
                <ReactIcon style={{
                    // border: '1px solid white'
                    // background: 'rgba(255, 255, 255, 0.1)'
                    stroke: "url(#accent-gradient)",
                    fill: "url(#accent-gradient)"
                }} size={'100%'} name={props.block.name as IconName} />
                :
                <Stack gap={10} style={{borderRadius: '10px'}} bg={'#00000080'} align="center" justify="center" h={'100%'}>
                    <FaIcons size={50} color={categoryColors.accentColor} />
                    <Text color={categoryColors.accentColor} size={'sm'}>Выберите иконку</Text>
                </Stack>

        }
    </>)
})

export default IconBlockEdit