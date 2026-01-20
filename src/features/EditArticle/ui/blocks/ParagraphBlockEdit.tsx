
import type { API, BlockMutationEvent } from "@editorjs/editorjs";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { createReactEditorJS } from 'react-editor-js';
import { useArticleStore } from "../../../../entities/article/contexts/article.context";
import type { Paragraph } from "../../../../entities/article/types/content.types";
import { EDITOR_JS_TOOLS } from "../../../../shared/config/editorjs.config";

const ParagraphBlockEdit: React.FC<{
    block: Paragraph
}> = observer((props) => {
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

    const holderId = `${props.block.id}-editorjs`;
    // useEditorJSPopoverToMantinePortal(holderId);
    useEffect(() => {
        const portalRoot =
            document.querySelector('[data-mantine-shared-portal-node="true"]') ??
            document.body;

        const movePopover = () => {
            const popover = document.querySelector('.ce-popover.ce-popover--opened');
            if (!popover) return;

            // если уже вынесен — ничего
            if (popover.parentElement === portalRoot) return;

            portalRoot.appendChild(popover);
            popover.classList.add('ej-bottom-sheet');
        };

        const obs = new MutationObserver(movePopover);
        obs.observe(document.body, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ['class'],
        });

        // на случай если уже открыт
        movePopover();

        return () => obs.disconnect();
    }, []);

    const checkOverflow = () => {
        const blocks = document.getElementsByClassName('ce-block');
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i] as HTMLElement;
            const parent = block.parentElement?.parentElement?.parentElement;
            if (!parent) continue
            const parentHeight = parent?.offsetHeight;
            const blockEndPosition = block.offsetTop + block.offsetHeight; 
            if (blockEndPosition > parentHeight) {
                block.style.color = 'red'
            }
            else {
                block.style.color = '#eaeaea'
            }
        }
    }

    const handleChange = (api: API, event: BlockMutationEvent | BlockMutationEvent[]) => {
        // console.log(api.blocks.)
        checkOverflow()
    };

    useEffect(()=>{
        checkOverflow()
    }, [props.block.layout.h, props.block.layout.w, props.block.layout.x, props.block.layout.y])

    return (<>
        <ReactEditorJS
            holder={holderId}
            placeholder={'Aaa'}
            tools={EDITOR_JS_TOOLS}
            onChange={handleChange}
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