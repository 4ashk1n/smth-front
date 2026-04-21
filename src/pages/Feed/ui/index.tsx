// pages/Feed/ui/index.tsx
import { type ArticleListResponse, type ArticleMeta } from "@smth/shared"
import { useCallback, useEffect, useRef, useState } from "react"
import { ArticleScopeProvider, ArticlesProvider } from "../../../entities/article/contexts/article.context"
import { ArticleModel } from "../../../entities/article/models/article.model"
import { ArticlesStore } from "../../../entities/article/stores/articles.store"
import { useCategoriesStore } from "../../../entities/category/contexts/categories.context"
import SlidingFeedContent from "../../../features/FeedNavigation/ui/SlidingFeedContent"
import VerticalArticleSwipeContainer from "../../../features/FeedNavigation/ui/VerticalArticleSwipeContainer"
import { apiRequest } from "../../../shared/api"
import ArticleScreen from "../../Article/ui/screen"

const FEED_PAGE_LIMIT = 10
const FEED_LAZYLOAD_THRESHOLD = 3

const FeedPage: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [containerHeight, setContainerHeight] = useState(0)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const categories = useCategoriesStore()
    const [articlesStore] = useState(() => new ArticlesStore(categories))
    const [articleIds, setArticleIds] = useState<string[]>([])
    const [page, setPage] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [isInitialLoading, setIsInitialLoading] = useState(false)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const loadedPagesRef = useRef<Set<number>>(new Set())
    const inFlightPagesRef = useRef<Set<number>>(new Set())

    useEffect(() => {
        const el = containerRef.current
        if (!el) return

        const update = () => {
            setContainerHeight(el.clientHeight)
        }

        update()

        const ro = new ResizeObserver(() => update())
        ro.observe(el)

        return () => {
            ro.disconnect()
        }
    }, [])

    const loadFeedPage = useCallback(async (pageToLoad: number, mode: "replace" | "append") => {
        if (mode === "append" && loadedPagesRef.current.has(pageToLoad)) return
        if (inFlightPagesRef.current.has(pageToLoad)) return

        inFlightPagesRef.current.add(pageToLoad)
        if (mode === "replace") {
            setIsInitialLoading(true)
        } else {
            setIsLoadingMore(true)
        }

        try {
            const res = await apiRequest<ArticleListResponse>("/articles", {
                method: "GET",
                query: {
                    page: pageToLoad,
                    limit: FEED_PAGE_LIMIT,
                    status: "published",
                },
            })

            const ids = res.data.items.map((item: ArticleMeta) => {
                const existing = articlesStore.getById(item.id)
                const article = existing ?? new ArticleModel(categories)
                article.fromMetaDTO(item)
                articlesStore.upsert(article)
                void article.fetchContent()
                return article.id
            })

            if (mode === "replace") {
                loadedPagesRef.current = new Set([res.data.page])
                setArticleIds(ids)
                setCurrentIndex(0)
            } else {
                loadedPagesRef.current.add(res.data.page)
                setArticleIds((prev) => Array.from(new Set([...prev, ...ids])))
            }

            setPage(res.data.page)
            setHasMore(res.data.hasMore)
        } finally {
            inFlightPagesRef.current.delete(pageToLoad)
            if (mode === "replace") {
                setIsInitialLoading(false)
            } else {
                setIsLoadingMore(false)
            }
        }
    }, [articlesStore, categories])

    useEffect(() => {
        void loadFeedPage(1, "replace")
    }, [loadFeedPage])

    useEffect(() => {
        if (articleIds.length === 0) return
        if (!hasMore || isInitialLoading || isLoadingMore) return

        const remaining = articleIds.length - 1 - currentIndex
        if (remaining > FEED_LAZYLOAD_THRESHOLD) return

        const nextPage = page + 1
        if (nextPage < 1) return

        void loadFeedPage(nextPage, "append")
    }, [currentIndex, articleIds.length, hasMore, isInitialLoading, isLoadingMore, page, loadFeedPage])


    if (containerHeight === 0 || articleIds.length === 0) {
        return (
            <div
                ref={containerRef}
                style={{ width: "100%", height: "100%", position: "relative" }}
            />
        )
    }


    return (
        <div
            ref={containerRef}
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                touchAction: "none",
            }}
        >
            
            <ArticlesProvider store={articlesStore}>
                <VerticalArticleSwipeContainer
                    index={currentIndex}
                    maxIndex={articleIds.length - 1}
                    onChange={setCurrentIndex}
                    height={containerHeight}
                    content={(swipeY) => (
                        <SlidingFeedContent
                            swipeY={swipeY}
                            itemsCount={articleIds.length}
                            currentIndex={currentIndex}
                            slideHeight={containerHeight}
                            renderItem={(idx) => (
                                <ArticleScopeProvider articleId={articleIds[idx]}>
                                    <ArticleScreen />
                                </ArticleScopeProvider>
                            )}
                        />
                    )}
                />
            </ArticlesProvider>
        </div>
    )
}

export default FeedPage
