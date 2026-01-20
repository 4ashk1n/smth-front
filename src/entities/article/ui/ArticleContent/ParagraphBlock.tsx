import { createReactEditorJS } from "react-editor-js"
import { useIsMobileScreen } from "../../../../shared/lib/useIsMobile"
import { useArticleStore } from "../../contexts/article.context"
import type { Paragraph } from "../../types/content.types"
import Object3dBlock from "./Object3dBlock"


const ParagraphBlock: React.FC<{ block: Paragraph }> = (props) => {
    const { mainCategory } = useArticleStore()
    const isMobile = useIsMobileScreen()

    const ReactEditorJS = createReactEditorJS()

    const Paragraph2d = () => (<>
        <ReactEditorJS
            holder={`${props.block.id}-editorjs`}
            readOnly={true}
            value={props.block.content}
        />
        {/* <Text
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
            <Markdown remarkRehypeOptions={{}}>{props.block.content}</Markdown>
        </Text> */}
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
}

export default ParagraphBlock