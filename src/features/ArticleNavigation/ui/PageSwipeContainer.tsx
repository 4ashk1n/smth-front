// features/ArticleNavigation/ui/PageSwipeContainer.tsx
import { useRef, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { useArticleStore } from "../../../entities/article/contexts/article.context"
import { useMotionValue, animate, type MotionValue } from "framer-motion"

const SWIPE_THRESHOLD = 40 // px

interface PageSwipeContainerProps {
  // контент, который будет двигаться при свайпе
  content: (swipeX: MotionValue<number>) => React.ReactNode
  // фиксированный оверлей (реакции, заголовки, точки)
  overlay: React.ReactNode
}

const PageSwipeContainer = observer(
  ({ content, overlay }: PageSwipeContainerProps) => {
    const article = useArticleStore()

    const swipeX = useMotionValue(0)

    const pages = article.content.pagesData
    const current = article.content.currentPage
    const currentOrder = current?.order ?? 0
    const maxOrder = pages.length - 1

    const touchStartX = useRef(0)
    const touchStartY = useRef(0)
    const isDragging = useRef(false)

    const changeToOrder = (order: number) => {
      const page = pages.find((p) => p.order === order)
      if (!page) return
      article.content.changePage(page.id)
    }

    const handleTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
      const t = e.touches[0]
      touchStartX.current = t.clientX
      touchStartY.current = t.clientY
      isDragging.current = false
    }

    const handleTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
      if (e.touches.length !== 1) return

      const t = e.touches[0]
      const dx = t.clientX - touchStartX.current
      const dy = t.clientY - touchStartY.current

      // если вертикальный жест сильнее — отдаем его скроллу
      if (!isDragging.current) {
        if (Math.abs(dx) < 10) return
        if (Math.abs(dy) > Math.abs(dx)) {
          // вертикальный скролл — выходим
          return
        }
        // начинаем горизонтальный свайп
        isDragging.current = true
      }

      // горизонтальный свайп — блокируем стандартный скролл страницы
      e.preventDefault()
      swipeX.set(dx)
    }

    const handleTouchEnd: React.TouchEventHandler<HTMLDivElement> = (e) => {
      if (!isDragging.current) {
        swipeX.set(0)
        return
      }

      const changed = e.changedTouches[0]
      const dx = changed.clientX - touchStartX.current
      const width = window.innerWidth || 375
      const duration = 0.18

      isDragging.current = false

      // маленький свайп — откатить назад
      if (Math.abs(dx) < SWIPE_THRESHOLD) {
        animate(swipeX, 0, { duration, ease: "easeOut" })
        return
      }

      // вправо — предыдущая
      if (dx > 0 && currentOrder > 0) {
        animate(swipeX, width, { duration, ease: "easeOut" }).then(() => {
          changeToOrder(currentOrder - 1)
          swipeX.set(0)
        })
        return
      }

      // влево — следующая
      if (dx < 0 && currentOrder < maxOrder) {
        animate(swipeX, -width, { duration, ease: "easeOut" }).then(() => {
          changeToOrder(currentOrder + 1)
          swipeX.set(0)
        })
        return
      }

      // край — откатить назад
      animate(swipeX, 0, { duration, ease: "easeOut" })
    }

    // при смене страницы не по свайпу — обнуляем смещение
    useEffect(() => {
      swipeX.set(0)
    }, [currentOrder, swipeX])

    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          touchAction: "pan-y", // даём системе вертикальный скролл
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        {/* ДВИЖУЩИЙСЯ КОНТЕНТ */}
        <div
          style={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          {content(swipeX)}
        </div>

        {/* ФИКСИРОВАННЫЙ ОВЕРЛЕЙ */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              pointerEvents: "auto", // внутри оверлея кнопки живут
            }}
          >
            {overlay}
          </div>
        </div>
      </div>
    )
  }
)

export default PageSwipeContainer
