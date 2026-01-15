import { Textarea } from "@mantine/core"

import { useContext, useEffect, useState } from "react"
import { useEditor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit';
import { RichTextEditor } from '@mantine/tiptap';
import Placeholder from '@tiptap/extension-placeholder';
import { Markdown } from 'tiptap-markdown-3';
import { observer } from "mobx-react"
import type { Paragraph } from "../../../../entities/article/types/content.types";
import { useArticleStore } from "../../../../entities/article/contexts/article.context";
import HighlitedBlock from "../../../../shared/ui/blocks/HighlitedBlock";

const ParagraphBlockEdit: React.FC<{ 
    block: Paragraph
}> = observer((props) => {
    const [block, setBlock] = useState(props.block)
    const article = useArticleStore()

   

    const saveChanges = () => {
        if (props.block.content === block.content) return
        article.content.editBlock(block)
    }
    
    // useEffect(() => {
    //     if (props.block.content === block.content && props.block.title === block.title) return
    //     editBlock(block)
    // }, [block.content, block.title])

    return (<>
        <HighlitedBlock onBlur={saveChanges} style={{ zIndex: 10 }} p={40} w='100%' h={'100%'} direction={'column'} gap={10} {...article.mainCategory.colors}>
            

        </HighlitedBlock>
    </>)
})

export default ParagraphBlockEdit