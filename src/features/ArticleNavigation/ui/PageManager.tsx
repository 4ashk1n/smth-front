import { Group } from "@mantine/core"
import { AnimatePresence, motion } from "framer-motion"
import { observer } from "mobx-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useArticleStore } from "../../../entities/article/contexts/article.context"
import type { Page } from "../../../entities/article/types/content.types"
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
	if (!article.content) return null
	const pages = article.content.pagesData
	const currentPageId = article.content.currentPageId

	const pagesKey = `${article.content.pages.size}_${currentPageId}`

	const { visiblePages, leftFakeDotsCount, rightFakeDotsCount } = useMemo(() => {
		if (!article.content) return { visiblePages: [], leftFakeDotsCount: 0, rightFakeDotsCount: 0 }
		const currentPage = article.content.currentPage
		const currentPageOrder = currentPage?.order ?? 0

		const start = Math.max(0, currentPageOrder - 2)
		const end = Math.min(pages.length, currentPageOrder + 3)
		const visiblePages = pages.slice(start, end)

		const leftFakeDotsCount = Math.max(0, 2 - currentPageOrder)
		const rightFakeDotsCount = Math.max(0, 2 - (pages.length - 1 - currentPageOrder))

		return { visiblePages, leftFakeDotsCount, rightFakeDotsCount }
	}, [pagesKey])

	const currentPageOrder = article.content.currentPage?.order ?? 0

	const [navigationDirection, setNavigationDirection] = useState(0)
	const isInitialRender = useRef(true)
	const prevOrderRef = useRef(currentPageOrder)

	useEffect(() => {
		if (isInitialRender.current) {
			isInitialRender.current = false
			prevOrderRef.current = currentPageOrder
			return
		}

		const prev = prevOrderRef.current
		const dir = currentPageOrder === prev ? 0 : currentPageOrder > prev ? 1 : -1
		setNavigationDirection(dir)
		prevOrderRef.current = currentPageOrder

		const timer = setTimeout(() => {
			setNavigationDirection(0)
		}, 400)

		return () => clearTimeout(timer)
	}, [currentPageOrder])


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
		if (!article.content) return null

		const direction = page.order > currentPageOrder ? 1 : -1
		setNavigationDirection(direction)

		article.content.changePage(page.id)
	}

	return (
		<Group
			wrap="nowrap"
			gap={0}
			opacity={+!article.content.dragMode}
			className="transition-opacity transition-duration-300 ease-in-out"
		>
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

			{rightFakeDotsCount > 0 && Array.from({ length: rightFakeDotsCount }).map((_, i) => (
				<FakeDot key={`right-fake-${i}`} />
			))}
		</Group>
	)
})

export default PageManager