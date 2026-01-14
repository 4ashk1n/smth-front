// features/ArticleNavigation/ui/SlidingArticleContent.tsx
import { observer } from "mobx-react-lite"
import { useArticleStore } from "../../../entities/article/contexts/article.context"
import ArticleContent from "../../../widgets/ArticleContent"
import { type MotionValue, useTransform, motion } from "framer-motion"
import { useLongPress } from "@mantine/hooks"

interface SlidingArticleContentProps {
  swipeX: MotionValue<number>
}

const SlidingArticleContent: React.FC<SlidingArticleContentProps> = observer(
  ({ swipeX }) => {
    const article = useArticleStore()
    const pages = article.content.pagesData
    const current = article.content.currentPage

    if (!current) return null

    const currentOrder = current.order
    const width = typeof window !== "undefined" ? window.innerWidth : 375

    // базовый сдвиг, чтобы current всегда был по центру при swipeX = 0
    const baseOffset = -currentOrder * width

    const translateX = useTransform(swipeX, (dx) => baseOffset + dx)


    const activateDragMode = useLongPress(() => {
      if (!article.content.editMode || article.swiping) return
      article.content.setDragMode(true)

    })
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
        { ...activateDragMode }
      >
        <motion.div
          style={{
            display: "flex",
            width: pages.length * width,
            height: "100%",
            x: translateX,
            willChange: "transform",
          }}
        >
          {pages.map((page) => (
            <div
              key={page.id}                         // 👈 стабильный key по id
              style={{ width, height: "100%", flexShrink: 0 }}
            >
              <ArticleContent page={page} />        {/* страница никогда не размонтируется */}
            </div>
          ))}
        </motion.div>
      </div>
    )
  }
)

export default SlidingArticleContent
