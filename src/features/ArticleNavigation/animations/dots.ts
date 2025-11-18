import type { Variants } from "framer-motion"

export const dotVariants: Variants = {
  enter: (props: { distance: number; direction: number; pageOrder: number; currentPageOrder: number }) => {
    const { direction, pageOrder, currentPageOrder } = props
    const isLeft = pageOrder < currentPageOrder
    const isRight = pageOrder > currentPageOrder
    
    if (isLeft) {
      // Точки слева: при переходе ВПРАВО уходят налево, при переходе НАЛЕВО приходят справа
      return {
        x: direction > 0 ? 20 : -20,
        opacity: 0,
        scale: 0.8
      }
    } else if (isRight) {
      // Точки справа: при переходе ВПРАВО приходят слева, при переходе НАЛЕВО уходят направо
      return {
        x: direction > 0 ? 20 : -20,
        opacity: 0,
        scale: 0.8
      }
    } else {
      // Центральная точка
      return {
        x: 0,
        opacity: 1,
        scale: 1
      }
    }
  },
  animate: (props: { distance: number; direction: number; pageOrder: number; currentPageOrder: number }) => {
    const { distance, pageOrder, currentPageOrder } = props
    const isCurrent = pageOrder === currentPageOrder
    
    return {
      x: 0,
      opacity: isCurrent ? 1 : (1 / (distance * 3)),
      scale: isCurrent ? 1 : 0.8,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  },
  exit: (props: { distance: number; direction: number; pageOrder: number; currentPageOrder: number }) => {
    const { direction, pageOrder, currentPageOrder } = props
    const isLeft = pageOrder < currentPageOrder
    const isRight = pageOrder > currentPageOrder
    
    if (isLeft) {
      // Точки слева: при переходе ВПРАВО уходят налево, при переходе НАЛЕВО приходят справа
      return {
        x: direction > 0 ? 20 : -20,
        opacity: 0,
        scale: 0.8,
        transition: {
          duration: 0.3,
          ease: "easeInOut"
        }
      }
    } else if (isRight) {
      // Точки справа: при переходе ВПРАВО приходят слева, при переходе НАЛЕВО уходят направо
      return {
        x: direction > 0 ? -20 : 20,
        opacity: 0,
        scale: 0.8,
        transition: {
          duration: 0.3,
          ease: "easeInOut"
        }
      }
    } else {
      // Центральная точка тоже должна исчезать плавно
      return {
        x: 0,
        opacity: 0,
        scale: 0.8,
        transition: {
          duration: 0.3,
          ease: "easeInOut"
        }
      }
    }
  }
}