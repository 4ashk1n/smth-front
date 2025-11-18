import { Text } from "@mantine/core"
import Markdown from "react-markdown"
import { useArticleStore } from "../../contexts/article.context"
import type { Paragraph } from "../../types/content.types"
import HighlitedBlock from "../../../../shared/ui/blocks/HighlitedBlock"
import Object3dBlock from "./Object3dBlock"
import { useIsMobileScreen } from "../../../../shared/lib/useIsMobile"


const ParagraphBlock: React.FC<{ block: Paragraph }> = (props) => {
    const { mainCategory } = useArticleStore()
    const isMobile = useIsMobileScreen()

    const Paragraph2d = () => (<>
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
            <Markdown remarkRehypeOptions={{}}>{props.block.content}</Markdown>
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
}

export default ParagraphBlock