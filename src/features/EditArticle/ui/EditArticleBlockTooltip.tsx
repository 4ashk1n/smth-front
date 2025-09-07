import { ActionIconGroup, ActionIcon } from "@mantine/core"
import { FaTrash } from "react-icons/fa6"
import { TbCube3dSphere } from "react-icons/tb"
import type { CategoryColors } from "../../../entities/category/types/CategoryColors"
import type { BlockTypes } from "../../../entities/article/types/Content"
import { useContext } from "react"
import { ArticleContext } from "../../stores/ArticleStore"
import UploadImage from "./UploadImage"
import type { Image } from "../../../entities/article/types/blocks/Image"

const EditArticleBlockTooltip: React.FC<{
    block: BlockTypes
}> = ({ block }) => {

    const { categoryColors, removeBlock, toggleBlock3d } = useContext(ArticleContext)


    return (<>
        <ActionIconGroup
            pos='absolute'
            top={0}
            right={0}
            style={{
                zIndex: '11',
                borderRadius: '0 10px 0 10px',
                overflow: 'hidden'
            }}
        >
            {
                block.type === 'image' ?
                    <UploadImage block={block as Image} /> : null
            }

            {
                block.type === 'icon' ?
                    <UploadImage block={block as any} /> : null
            }

            <ActionIcon
                size='md'
                autoContrast
                color={categoryColors.accentColor}
                onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (document.activeElement) {
                        document.activeElement.blur();
                    }
                    toggleBlock3d(block.layout.i)
                }}
            >
                <TbCube3dSphere size={16} />
            </ActionIcon>

            <ActionIcon
                size='md'
                autoContrast
                color={categoryColors.accentColor}
                onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); removeBlock(block.layout.i) }}
            >
                <FaTrash size={12} />
            </ActionIcon>
        </ActionIconGroup>
    </>)
}

export default EditArticleBlockTooltip