import { motion, useTransform, type MotionValue } from "framer-motion"
import { observer } from "mobx-react"

interface SlidingFeedContentProps {
    swipeY: MotionValue<number>
    itemsCount: number
    currentIndex: number
    slideHeight: number
    renderItem: (index: number) => React.ReactNode
}

const SlidingFeedContent: React.FC<SlidingFeedContentProps> = observer(
    ({ swipeY, itemsCount, currentIndex, slideHeight, renderItem }) => {
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : null
        const nextIndex =
            currentIndex < itemsCount - 1 ? currentIndex + 1 : null

        const indices: number[] = []
        if (prevIndex !== null) indices.push(prevIndex)
        indices.push(currentIndex)
        if (nextIndex !== null) indices.push(nextIndex)

        const currentPos = indices.indexOf(currentIndex)
        const baseOffset = -currentPos * slideHeight

        const translateY = useTransform(swipeY, (dy) => baseOffset + dy)

        return (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                }}
            >
                <motion.div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        height: indices.length * slideHeight,
                        y: translateY,
                        willChange: "transform",
                    }}
                >
                    {indices.map((idx) => (
                        <div
                            key={idx}
                            style={{
                                width: "100%",
                                height: slideHeight,      
                                flexShrink: 0,
                                position: "relative",
                            }}
                        >
                            {renderItem(idx)}
                        </div>
                    ))}
                </motion.div>
            </div>
        )
    }
)


export default SlidingFeedContent