import { Textarea } from "@mantine/core"
import type { Paragraph } from "../../../../entities/article/types/blocks/Paragraph"
import HighlitedBlock from "../../../../shared/blocks/HighlitedBlock"
import { useContext, useEffect, useState } from "react"
import { useEditor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit';
import { RichTextEditor } from '@mantine/tiptap';
import Placeholder from '@tiptap/extension-placeholder';
import { Markdown } from 'tiptap-markdown-3';
import { ArticleContext } from "../../../stores/ArticleStore"
import { observer } from "mobx-react-lite"

const ParagraphBlockEdit: React.FC<{ 
    block: Paragraph
}> = observer((props) => {
    const [block, setBlock] = useState(props.block)
    const { editBlock, categoryColors } = useContext(ArticleContext)

    const editor = useEditor({
        extensions: [
            StarterKit,
            Markdown,
            Placeholder.configure({ placeholder: 'Текст' }),
        ],
        content: block.content,
        onUpdate: ({ editor }) => {
            // setContent(editor.storage.markdown.getMarkdown())
            setBlock({ ...block, content: editor.storage.markdown.getMarkdown() })
        },
    })

    const saveChanges = () => {
        if (props.block.content === block.content && props.block.title === block.title) return
        editBlock(block)
    }
    
    // useEffect(() => {
    //     if (props.block.content === block.content && props.block.title === block.title) return
    //     editBlock(block)
    // }, [block.content, block.title])

    return (<>
        <HighlitedBlock onBlur={saveChanges} style={{ zIndex: 10 }} p={40} w='100%' h={'100%'} direction={'column'} gap={10} {...categoryColors}>
            <Textarea
                autosize
                fw={600}
                placeholder="Заголовок"
                defaultValue={block.title}
                onMouseDown={(e) => { e.stopPropagation(); e.preventDefault }}
                onChange={(e) => setBlock({ ...block, title: e.currentTarget.value })}
                variant="unstyled"
                h={'fit-content'}
                styles={{
                    input: {
                        fontSize: '24px',
                        color: 'white',
                        borderRadius: '10px'
                    }
                }} />

            <RichTextEditor
                fz={18}
                variant="subtle"
                editor={editor}
                onMouseDown={(e) => { e.stopPropagation(); e.preventDefault }}
                styles={{
                    root: {
                        border: 'none',
                        padding: '0px'
                    },
                    content: {
                        backgroundColor: 'transparent',
                        color: 'white',
                        padding: '0px'
                    },
                }}
            >

                {
                    editor &&
                    <BubbleMenu editor={editor} >
                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Bold />
                            <RichTextEditor.Italic />
                            <RichTextEditor.Underline />
                        </RichTextEditor.ControlsGroup>
                    </BubbleMenu>
                }

                <RichTextEditor.Content
                
                    className="[&>*>.ProseMirror]:p-0!"
                    style={{ cursor: 'text' }}
                />

            </RichTextEditor>

        </HighlitedBlock>
    </>)
})

export default ParagraphBlockEdit