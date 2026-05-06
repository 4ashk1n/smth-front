import { observer } from "mobx-react"
import { useEffect, useRef, useState } from "react"
import { PiTrashDuotone } from "react-icons/pi"
import { useArticleStore } from "../../../../entities/article/contexts/article.context"

const DeleteBlockArea: React.FC<{}> = observer(() => {
    const article = useArticleStore()
    const ref = useRef<HTMLDivElement>(null)
    const [active, setActive] = useState(false)
    if (!article.content) return null

    useEffect(() => {
        if (!ref.current) return
        if (!article.content) return
        if (!article.content.dragMode) return
        const pos = ref.current.getBoundingClientRect()

        setActive(!(
            article.content.currentDragPos.x < pos.x ||
            article.content.currentDragPos.y < pos.y ||
            article.content.currentDragPos.x > pos.x + pos.width ||
            article.content.currentDragPos.y > pos.y + pos.height
        ));
    }, [article.content.currentDragPos.x, article.content.currentDragPos.y, article.content.dragMode])

    useEffect(() => {
        if (!article.content) return 
        if (!article.content.isDragging && active) {
            article.content.deleteBlock(article.content.currentBlockId)
            setActive(false)
        }
        else if (!article.content.isDragging) {
            setActive(false)
        }
    }, [article.content.isDragging, active])

    return (<>
        <div
            ref={ref}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '12px',
                marginLeft: 'auto',
                marginRight: 'auto',
                width: 'fit-content',
                borderRadius: '10px',
                background: article.mainCategory.colors.accentColor + (active ? 'ff' : '80'),
                backdropFilter: 'blur(5px)',
                boxShadow: '0px 2px 5px 0px #00000020',
                opacity: +article.content.dragMode,
                transition: '0.2s ease-in-out',
                transform: active ? 'scale(1.1)' : 'scale(1)',
            }}
        >
            <PiTrashDuotone size={24} color={article.mainCategory.colors.darkColor} />
        </div>
    </>)
})

export default DeleteBlockArea