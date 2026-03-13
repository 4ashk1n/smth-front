
import type { API, BlockMutationEvent } from "@editorjs/editorjs";
import { observer } from "mobx-react";
import { useEffect, useMemo } from "react";
import { createReactEditorJS } from 'react-editor-js';
import { useArticleStore } from "../../../../entities/article/contexts/article.context";
import type { Paragraph } from "../../../../entities/article/types/content.types";
import { EDITOR_JS_TOOLS } from "../../../../shared/config/editorjs.config";
import MultiPopoverWithDrawer from "../../../../shared/ui/popover/MultiPopoverWithDrawer";

const ParagraphBlockEdit: React.FC<{
    block: Paragraph
}> = observer((props) => {
    const article = useArticleStore()
    const ReactEditorJS = createReactEditorJS()

    const holderId = `${props.block.id}-editorjs`;
    const blockSuggestions = useMemo(
        () => article.aiSuggestions.filter((suggestion) => suggestion.blockId === props.block.id),
        [article.aiSuggestions, props.block.id],
    );

    useEffect(() => {
        const portalRoot =
            document.querySelector('[data-mantine-shared-portal-node="true"]') ??
            document.body;

        const movePopover = () => {
            const popover = document.querySelector('.ce-popover.ce-popover--opened');
            if (!popover) return;

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
        api.saver.save().then((outputData) => {
            article.content.editBlock({ ...props.block, content: outputData })
        }).catch((error) => {
            console.log('Saving failed: ', error)
        });
    };

    useEffect(() => {
        checkOverflow()
    }, [props.block.layout.h, props.block.layout.w, props.block.layout.x, props.block.layout.y])

    return (<>
        <ReactEditorJS
            holder={holderId}
            placeholder={'Aaa'}
            tools={EDITOR_JS_TOOLS}
            onChange={handleChange}
            onReady={checkOverflow}
            defaultValue={props.block.content}
        >
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <div
                    id={holderId}
                    style={{
                        width: '100%',
                        height: '100%',
                        border: '2px dashed ' + article.mainCategory.colors.accentColor + '80',
                        borderRadius: '10px',
                    }}
                >

                </div>
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 10,
                        transform: "translateY(-100%)",
                        zIndex: 30,
                    }}
                >
                    <MultiPopoverWithDrawer suggestions={blockSuggestions} hidden={article.swiping} />
                </div>
            </div>
        </ReactEditorJS >
    </>)
})

export default ParagraphBlockEdit
