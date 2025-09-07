import { Text } from "@mantine/core"
import type { Paragraph } from "../../../entities/article/types/blocks/Paragraph"
import type { Category } from "../../../entities/category/types/Category"
import HighlitedBlock from "../../../shared/blocks/HighlitedBlock"
import Object3dBlock from "../../../shared/blocks/Object3dBlock"
import type { CategoryColors } from "../../../entities/category/types/CategoryColors"
import Markdown from "react-markdown"


const ParagraphBlock: React.FC<{ block: Paragraph, mainCategory: CategoryColors }> = (props) => {
    const Paragraph2d = () => (<>
        <HighlitedBlock style={{zIndex: 10}} p={40} w='100%' direction={'column'} gap={10} {...props.mainCategory}>
            <Text fz={24} c='white' fw={700} lh={'1.25'}>{props.block.title}</Text>
            
            <Text fz={18} lh={'1.4'} fw={400} c='#ffffff80'>
                <Markdown>{props.block.content}</Markdown>
            </Text>
        </HighlitedBlock>
    </>)

    return (<> 
        {
            props.block.object3d ? 
                <Object3dBlock blocktype={'paragraph'} {...props.block.object3d} {...props.mainCategory}>
                    <Paragraph2d />
                </Object3dBlock>
                : <Paragraph2d />
        }
    </>)
}

export default ParagraphBlock