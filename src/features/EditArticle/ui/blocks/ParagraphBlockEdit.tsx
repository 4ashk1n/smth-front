
import { observer } from "mobx-react";
import { useState } from "react";
import { createReactEditorJS } from 'react-editor-js';
import { useArticleStore } from "../../../../entities/article/contexts/article.context";
import type { Paragraph } from "../../../../entities/article/types/content.types";
import { EDITOR_JS_TOOLS } from "../../../../shared/config/editorjs.config";
import { useEditorJSPopoverToMantinePortal } from "../../hooks/useEditorJSPopoverToMantinePortal";

const ParagraphBlockEdit: React.FC<{
    block: Paragraph
}> = observer((props) => {
    const [block, setBlock] = useState(props.block)
    const article = useArticleStore()

    const ReactEditorJS = createReactEditorJS()

    const saveChanges = () => {
        // if (props.block.content === block.content) return
        // article.content.editBlock(block)
    }

    // useEffect(() => {
    //     if (props.block.content === block.content && props.block.title === block.title) return
    //     editBlock(block)
    // }, [block.content, block.title])

    const holderId = `${block.id}-editorjs`;
    useEditorJSPopoverToMantinePortal(holderId);

    return (<>
        <ReactEditorJS
            holder={holderId}
            placeholder={'Aaa'}
            tools={EDITOR_JS_TOOLS}

        >
            {/* <HighlitedBlock id={`${block.id}-editorjs`} onBlur={saveChanges} style={{ zIndex: 10 }} p={40} w='100%' h={'100%'} direction={'column'} gap={10} {...article.mainCategory.colors}> */}
            <div
                id={holderId}
                onBlur={saveChanges}
                style={{
                    width: '100%',
                    height: '100%',
                    border: '2px dashed ' + article.mainCategory.colors.accentColor + '80',
                    borderRadius: '10px',
                }}
            >

            </div>

            {/* </HighlitedBlock > */}
        </ReactEditorJS >
    </>)
})

export default ParagraphBlockEdit