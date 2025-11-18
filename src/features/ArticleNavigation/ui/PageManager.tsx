import { Group } from "@mantine/core"
import { useArticleStore } from "../../../entities/article/contexts/article.context"
import { useMemo, useRef, useState, useEffect } from "react"
import type { Page } from "../../../entities/article/types/content.types"
import { observer } from "mobx-react-lite"
import { motion, AnimatePresence } from "framer-motion"
import { dotVariants } from "../animations/dots"


const FakeDot: React.FC<{}> = () => {
  const article = useArticleStore()

  return (
    <div className="flex items-center px-[4px] py-[12px] opacity-0">
      <div
        style={{
          width: 8,
          height: 8,
          background: article.mainCategory.colors.lightColor,
          borderRadius: '20px',
        }}
      />
    </div>
  )
}

const PageManager = observer(() => {
  const article = useArticleStore()
  const pages = useMemo(() => article.content.pagesData, [article.content.pages])
  const currentPageOrder = useMemo(() => article.content.currentPage?.order ?? 0, [article.content.currentPageId])
  
  const [navigationDirection, setNavigationDirection] = useState(0)
  const isInitialRender = useRef(true)

  // Сбрасываем направление после анимации
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false
      return
    }

    const timer = setTimeout(() => {
      setNavigationDirection(0)
    }, 400) // Длительность анимации

    return () => clearTimeout(timer)
  }, [currentPageOrder])

  // Всегда показываем 5 точек вокруг текущей
  const visiblePages = useMemo(() => {
    const start = Math.max(0, currentPageOrder - 2)
    const end = Math.min(pages.length, currentPageOrder + 3)
    return pages.slice(start, end)
  }, [pages, currentPageOrder])

  const leftFakeDotsCount = useMemo(() => {
    return Math.max(0, 2 - currentPageOrder)
  }, [currentPageOrder])

  const rightFakeDotsCount = useMemo(() => {
    return Math.max(0, 2 - (pages.length - 1 - currentPageOrder))
  }, [currentPageOrder, pages.length])

  const getAnimationProps = (page: Page) => {
    const distance = Math.abs(page.order - currentPageOrder)
    return {
      distance,
      direction: navigationDirection,
      pageOrder: page.order,
      currentPageOrder
    }
  }

  const handlePageClick = (page: Page) => {
    if (page.order === currentPageOrder) return
    
    // Синхронно устанавливаем направление
    const direction = page.order > currentPageOrder ? 1 : -1
    setNavigationDirection(direction)
    
    article.content.changePage(page.id)
  }

  return (
    <Group wrap="nowrap" gap={0}>
      {/* Фиктивные точки слева для выравнивания */}
      {leftFakeDotsCount > 0 && Array.from({ length: leftFakeDotsCount }).map((_, i) => (
        <FakeDot key={`left-fake-${i}`} />
      ))}
      
      <AnimatePresence mode="popLayout">
        {visiblePages.map((page) => {
          return (
            <motion.div
              key={`${page.id}-${page.order}`}
              variants={dotVariants}
              initial="enter"
              animate="animate"
              exit="exit"
              custom={getAnimationProps(page)}
              layout
              transition={{
                duration: 0.4,
                ease: "easeInOut"
              }}
              className="hover:cursor-pointer hover:opacity-100! flex items-center px-[4px] py-[12px]"
              onClick={() => handlePageClick(page)}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  background: article.mainCategory.colors.lightColor,
                  borderRadius: '20px',
                  boxShadow: `0px 0px 5px 0px ${article.mainCategory.colors.darkColor}40`,
                }}
              />
            </motion.div>
          )
        })}
      </AnimatePresence>

      {/* Фиктивные точки справа для выравнивания */}
      {rightFakeDotsCount > 0 && Array.from({ length: rightFakeDotsCount }).map((_, i) => (
        <FakeDot key={`right-fake-${i}`} />
      ))}
    </Group>
  )
})

export default PageManager