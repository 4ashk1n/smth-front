import type { Paragraph } from "../../../entities/article/types/blocks/Paragraph"
import type { BlockTypes } from "../../../entities/article/types/Content"
import Object3dBlockEdit from "./blocks/Object3dBlockEdit"
import ParagraphBlockEdit from "./blocks/ParagraphBlockEdit"
import EditArticleBlockTooltip from "./EditArticleBlockTooltip"
import ImageBlockEdit from "./blocks/ImageBlockEdit"
import type { Image } from "../../../entities/article/types/blocks/Image"
import IconBlockEdit from "./blocks/IconBlockEdit"

export const EditArticleBlock: React.FC<{
    block: BlockTypes
}> = ({ block }) => {

    const EditArticleBlock2d = () => (<>
        {
            block.type === 'paragraph' ?
                <ParagraphBlockEdit block={block as Paragraph} /> :
                block.type === 'image' ?
                <ImageBlockEdit block={block as Image} /> :
                    block.type === 'icon' ?
                        <IconBlockEdit block={block as any} /> : null
        }

        <EditArticleBlockTooltip block={block} />
    </>)

    return (<>
        {
            block.object3d ?
                <Object3dBlockEdit block={block}>
                    <EditArticleBlock2d />
                </Object3dBlockEdit> :
                <EditArticleBlock2d />
        }
    </>)
}
