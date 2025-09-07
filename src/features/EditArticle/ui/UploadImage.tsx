import { FileButton, ActionIcon } from "@mantine/core"
import { FaPlus } from "react-icons/fa6"
import type { BlockTypes } from "../../../entities/article/types/Content"
import { useContext, useEffect, useState } from "react"
import { ArticleContext } from "../../stores/ArticleStore"
import { LuImageUp } from "react-icons/lu"
import type { Image } from "../../../entities/article/types/blocks/Image"

const UploadImage: React.FC<{
    block: Image
}> = ({ block }) => {

    const { categoryColors } = useContext(ArticleContext)
    const [file, setFile] = useState<File | null>(null)

    useEffect(() => {
        if (!file) return
        const reader = new FileReader()
        reader.onload = () => {
            block.url = reader.result as string
        }
        reader.readAsDataURL(file)
    }, [file])

    return (<>
        <FileButton
            onChange={setFile}
            accept="image/*"
        >
            {
                (props) =>
                    <ActionIcon
                        radius={0}
                        autoContrast
                        size="md"
                        {...props}
                        color={categoryColors.accentColor}
                        variant="filled"
                    >
                        <LuImageUp size={15} />
                    </ActionIcon>
            }
        </FileButton>
    </>)
}

export default UploadImage