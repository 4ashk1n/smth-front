import {
  createContext,
  useContext,
  type ReactNode,
} from "react"
import type { MotionValue } from "framer-motion"

const HorizontalParallaxContext = createContext<MotionValue<number> | null>(
  null
)

export const HorizontalParallaxProvider = ({
  value,
  children,
}: {
  value: MotionValue<number>
  children: ReactNode
}) => (
  <HorizontalParallaxContext.Provider value={value}>
    {children}
  </HorizontalParallaxContext.Provider>
)

export const useHorizontalParallax = () => useContext(HorizontalParallaxContext)
