// features/ArticleNavigation/ui/ArticleContentWithPreload.tsx
import { observer } from "mobx-react"
import React from "react"
import { useArticleStore } from "../../../entities/article/contexts/article.context"
import ArticleContent from "../../../widgets/ArticleContent"

const ArticleContentWithPreload: React.FC = observer(() => {
	const article = useArticleStore()
	if (!article.content) return null
	const pages = article.content.pagesData
	const current = article.content.currentPage

	if (!current) return null

	const currentOrder = current.order
	const prev = pages.find((p) => p.order === currentOrder - 1)
	const next = pages.find((p) => p.order === currentOrder + 1)

	return (
		<>
			<ArticleContent />

			<div style={{ display: "none" }}>
				{prev && <ArticleContent page={prev} />}
				{next && <ArticleContent page={next} />}
			</div>
		</>
	)
})

export default ArticleContentWithPreload
