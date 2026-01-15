import { useGesture } from "@use-gesture/react"
import { motion, useMotionValue, animate, MotionValue } from "framer-motion"
import { useRef } from "react"
import { observer } from "mobx-react"

interface Props {
    index: number
    maxIndex: number
    height: number
    onChange: (next: number) => void
    content: (swipeY: MotionValue<number>) => React.ReactNode
}

const VerticalArticleSwipeContainer = observer(({
    index,
    maxIndex,
    height,
    onChange,
    content,
}: Props) => {
    const y = useMotionValue(0)
    const ref = useRef<HTMLDivElement>(null)
    useGesture(
        {
            
            onDrag: ({ movement: [mx, my], last, cancel }) => {
                console.log(2)
                // если пользователь повёл больше по X — не трогаем вертикаль
                if (Math.abs(mx) > Math.abs(my)) {
                    cancel?.()
                    return
                }

                y.set(my)

                if (!last) return

                if (Math.abs(my) < height * 0.2) {
                    animate(y, 0)
                    return
                }

                // вверх => next
                if (my < 0 && index < maxIndex) {
                    animate(y, -height).then(() => {
                        onChange(index + 1)
                        y.set(0)
                    })
                    return
                }

                // вниз => prev
                if (my > 0 && index > 0) {
                    animate(y, height).then(() => {
                        onChange(index - 1)
                        y.set(0)
                    })
                    return
                }

                animate(y, 0)
            },
        },
        {
            target: ref,
            drag: { axis: "y", threshold: 10, filterTaps: true },
        }
    )


    return (
        <motion.div
            ref={ref}
            style={{
                position: "absolute",
                inset: 0,
                touchAction: "none",
                zIndex: 10,
                width: "100%",
                height: "100%",
            }}
        >

            {content(y)}
        </motion.div>
    )
})

export default VerticalArticleSwipeContainer