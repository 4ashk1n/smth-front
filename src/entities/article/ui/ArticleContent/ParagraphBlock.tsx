import { Text } from "@mantine/core"
import { observer } from "mobx-react"
import { createReactEditorJS } from "react-editor-js"
import { useIsMobileScreen } from "../../../../shared/lib/useIsMobile"
import { useArticleStore } from "../../contexts/article.context"
import type { Paragraph } from "../../types/content.types"
import Object3dBlock from "./Object3dBlock"


const ParagraphBlock: React.FC<{ block: Paragraph }> = observer((props) => {
    const { mainCategory } = useArticleStore()
    const isMobile = useIsMobileScreen()

    const ReactEditorJS = createReactEditorJS()
    const contentKey = (() => {
        try {
            return JSON.stringify(props.block.content ?? {})
        } catch {
            return String(props.block.content)
        }
    })()

    const Paragraph2d = () => (<>
        {/* <ReactEditorJS
            key={contentKey}
            holder={`${props.block.id}-editorjs`}
            readOnly={true}
            defaultValue={props.block.content}
        /> */}
        <Text
            fz={isMobile ? 14 : 16}
            lh={isMobile ? '16px' : '18px'}
            fw={400}
            c={`${mainCategory.colors.lightColor}`}
            style={{ 
                textAlign: 'justify', 
                overflowWrap: 'break-word', 
                hyphens: 'auto', 
                textIndent: isMobile ? '16px' : '18px', 
                textShadow: '0 4px 4px rgba(0, 0, 0, 0.25)' 
            }}
        >
            {props.block.content.blocks.map((block: any) => block.data.text).join('\n')}
        </Text>
    </>)

    return (<>
        {
            props.block.object3d ?
                <Object3dBlock blocktype={'paragraph'} {...props.block.object3d} {...mainCategory.colors}>
                    <Paragraph2d />
                </Object3dBlock>
                : <Paragraph2d />
        }
    </>)
})

export default ParagraphBlock
