import { useLongPress } from "@mantine/hooks"
import { motion, type MotionValue, useTransform } from "framer-motion"
import { observer } from "mobx-react"
import { useArticleStore } from "../../../entities/article/contexts/article.context"
import ArticleContent from "../../../widgets/ArticleContent"

interface SlidingArticleContentProps {
  swipeX: MotionValue<number>
}

const SlidingArticleContent: React.FC<SlidingArticleContentProps> = observer(
  ({ swipeX }) => {
    const article = useArticleStore()
    const pages = article.content.pagesData
    let current = article.content.currentPage

    if (!current) {
      current = article.content.getPageByOrder(pages.length - 1)
    }

    const width = typeof window !== "undefined" ? window.innerWidth : 375
    
    const currentOrder = current?.order ?? 0
    
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
              key={page.id}
              style={{ width, height: "100%", flexShrink: 0 }}
            >
              <ArticleContent page={page} />
            </div>
          ))}
        </motion.div>
      </div>
    )
  }
)

export default SlidingArticleContent