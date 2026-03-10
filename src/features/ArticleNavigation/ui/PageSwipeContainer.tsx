import { useGesture } from "@use-gesture/react"
import { animate, motion, MotionValue, useMotionValue } from "framer-motion"
import { observer } from "mobx-react"
import { useRef } from "react"
import { useArticleStore } from "../../../entities/article/contexts/article.context"

interface Props {
  overlay: React.ReactNode
  children: (swipeX: MotionValue<number>) => React.ReactNode
  lockAxis?: (axis: "x" | "y") => void // пригодится для пункта 3
}

const PageSwipeContainer = observer(({ children, overlay, lockAxis }: Props) => {
  const ref = useRef<HTMLDivElement>(null)
  const article = useArticleStore()
  const pages = article.content.pagesData
  const currentPageId = article.content.currentPage?.id
  const pageIndex = Math.max(0, pages.findIndex((page) => page.id === currentPageId))

  const x = useMotionValue(0)
  const width = typeof window !== "undefined" ? window.innerWidth : 375

  useGesture(
    {
      onDrag: ({ movement: [mx, my], last, cancel }) => {
        if (article.content.dragMode) {
          return
        };


        // axis lock: если пользователь повёл больше по Y — не крадём вертикаль
        if (Math.abs(my) > Math.abs(mx)) {
          cancel?.()
          return
        }
        lockAxis?.("x")

        article.setSwiping(true)

        x.set(mx)

        if (!last) return

        const passed = Math.abs(mx) > width * 0.15
        if (!passed) {
          animate(x, 0)
          return
        }

        console.log(pageIndex)
        // mx < 0 => влево => next
        if (mx < 0 && pageIndex < pages.length - 1) {
          animate(x, -width).then(() => {
            article.content.changePage(pages[pageIndex + 1]?.id ?? "")
            x.set(0)
          })
          return
        }

        // mx > 0 => вправо => prev
        if (mx > 0 && pageIndex > 0) {
          animate(x, width).then(() => {
            article.content.changePage(pages[pageIndex - 1]?.id ?? "")
            x.set(0)
          })
          return
        }

        animate(x, 0)
      },
      onDragEnd: () => {
        article.setSwiping(false)
      }
    },
    {
      target: ref,
      drag: { axis: "x", threshold: 10, filterTaps: true },
    }
  )

  return (
    <motion.div
      ref={ref}
      style={{
        position: "absolute",
        inset: 0,
        touchAction: "none",
      }}
    >
      {children(x)}

      {/* overlay НЕ должен быть авто-кликабельным на весь экран */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {overlay}
      </div>
    </motion.div>
  )
})

export default PageSwipeContainer
