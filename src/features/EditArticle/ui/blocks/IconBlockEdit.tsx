import { useContext, useEffect, useState } from "react"
import type { Icon } from "../../../../entities/article/types/blocks/Icon"
import { observer } from "mobx-react-lite"
import ReactIcon, { type IconName } from "../../../../shared/icon/ReactIcon"
import { FaIcons } from "react-icons/fa6"
import { Stack, Text } from "@mantine/core"
import { ArticleContext } from "../../../stores/ArticleStore"
import IconSelectMenu from "../../../../shared/icon/IconSelectMenu"

const IconBlockEdit: React.FC<{
    block: Icon
}> = observer((props) => {
    const [block, setBlock] = useState(props.block)
    const { editBlock, categoryColors } = useContext(ArticleContext)

    const saveChanges = () => {
        if (props.block.name === block.name) return
        editBlock(block)
    }

    useEffect(() => {
        saveChanges()
        // console.log(block.name)
    }, [block.name])

    return (<>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>

            {
                block.name ?
                    <>
                        <svg width="1px" height="1px" style={{ visibility: 'hidden' }}>
                            <linearGradient id="accent-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
                                <stop stopColor={categoryColors.lightColor} offset="0%" />
                                <stop stopColor={categoryColors.darkColor} offset="100%" /> 
                            </linearGradient>
                        </svg>
                        <ReactIcon style={{
                            // border: '1px solid white'
                            // background: 'rgba(255, 255, 255, 0.1)'
                            stroke: "url(#accent-gradient)",
                            fill: "url(#accent-gradient)",
                            overflow: 'visible'
                        }} size={'100%'} name={props.block.name as IconName} />
                    </>

                    :
                    <IconSelectMenu h='100%' w='100%' setIcon={(icon: string) => {
                        setBlock({ ...block, name: icon })
                    }} />

            }
        </div>
    </>)
})

export default IconBlockEdit