import { Stack } from "@mantine/core"
import PageManager from "../../../features/ArticleNavigation/ui/PageManager"
import ArticleHeader from "../../../entities/article/ui/ArticleHeader"
import ActionButtons from "../../../features/ArticleReaderActions/ui/ActionButtons"
import { useArticleStore } from "../../../entities/article/contexts/article.context"
import { observer } from "mobx-react"
import { motion } from "framer-motion"
import ActionsMenu from "./ActionsMenu"

const ArticleOverlay = observer(() => {
  const article = useArticleStore()
  const visible = article.content.currentPageId !== "cover"
  

  return (
    <motion.div
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : 20,
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        pointerEvents: "none", // 🔥 ВАЖНО
      }}
    >
      <Stack
        gap={12}
        pt={12}
        pb={92}
        align="center"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          background: "linear-gradient(0deg, #00000080, #00000000 100%)",
          pointerEvents: "auto", // 🔥 кнопки работают
          touchAction: "none",   // 🔥 свайпы не начинаются отсюда
        }}
      >
        <PageManager />
        <ArticleHeader />
        <ActionsMenu />
      </Stack>
    </motion.div>
  )
})

export default ArticleOverlay
