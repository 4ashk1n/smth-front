// pages/Feed/ui/index.tsx
import { type ArticleListResponse, type ArticleMeta } from "@smth/shared"
import { useCallback, useEffect, useRef, useState } from "react"
import { ArticleScopeProvider, ArticlesProvider } from "../../../entities/article/contexts/article.context"
import { ArticleModel } from "../../../entities/article/models/article.model"
import { ArticlesStore } from "../../../entities/article/stores/articles.store"
import { useCategoriesStore } from "../../../entities/category/contexts/categories.context"
import { useAuthStore } from "../../../entities/user/contexts/auth.context"
import { sendArticleReadMetrics } from "../../../features/ArticleReaderMetrics/api/sendArticleReadMetrics"
import SlidingFeedContent from "../../../features/FeedNavigation/ui/SlidingFeedContent"
import VerticalArticleSwipeContainer from "../../../features/FeedNavigation/ui/VerticalArticleSwipeContainer"
import { apiRequest } from "../../../shared/api"
import ArticleScreen from "../../Article/ui/screen"

const FEED_PAGE_LIMIT = 10
const FEED_LAZYLOAD_THRESHOLD = 3

type FeedReadSession = {
    articleId: string
    focusMs: number
    lastTickAt: number
    firstViewedAt: string
    lastViewedAt: string
    viewedPages: Set<string>
}

const nowIso = () => new Date().toISOString()

const FeedPage: React.FC = () => {
    const auth = useAuthStore()
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
    const activeArticleIdRef = useRef<string>("")
    const pageUnsubscribeRef = useRef<(() => void) | null>(null)
    const readSessionRef = useRef<FeedReadSession | null>(null)

    const cleanupPageSubscription = useCallback(() => {
        pageUnsubscribeRef.current?.()
        pageUnsubscribeRef.current = null
    }, [])

    const startReadSession = useCallback((articleId: string) => {
        if (!articleId || !auth.user) return
        readSessionRef.current = {
            articleId,
            focusMs: 0,
            lastTickAt: Date.now(),
            firstViewedAt: nowIso(),
            lastViewedAt: nowIso(),
            viewedPages: new Set(),
        }
    }, [auth.user])

    const trackPageVisit = useCallback((articleId: string, pageId: string) => {
        if (!pageId || pageId === "cover") return
        const session = readSessionRef.current
        if (!session || session.articleId !== articleId) return
        session.viewedPages.add(pageId)
        session.lastViewedAt = nowIso()
    }, [])

    const flushReadSession = useCallback(async (options: { keepalive?: boolean; articleId?: string } = {}) => {
        const session = readSessionRef.current
        if (!session || !auth.user) return
        if (options.articleId && session.articleId !== options.articleId) return

        const focusTimeDelta = Math.floor(session.focusMs / 1000)
        const viewedPagesDelta = session.viewedPages.size

        if (focusTimeDelta <= 0 && viewedPagesDelta <= 0 && !session.firstViewedAt && !session.lastViewedAt) {
            readSessionRef.current = null
            return
        }

        readSessionRef.current = null

        try {
            await sendArticleReadMetrics(
                session.articleId,
                {
                    focusTimeDelta,
                    viewedPagesDelta,
                    firstViewedAt: session.firstViewedAt,
                    lastViewedAt: session.lastViewedAt,
                },
                { keepalive: options.keepalive },
            )
        } catch (error) {
            console.error("Failed to send read metrics", error)
        }
    }, [auth.user])

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
            const res = auth.user
                ? await auth.requestWithAutoRefresh<ArticleListResponse>("/articles/feed", {
                    method: "GET",
                    query: {
                        page: pageToLoad,
                        limit: FEED_PAGE_LIMIT,
                    },
                })
                : await apiRequest<ArticleListResponse>("/articles", {
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

    useEffect(() => {
        if (!auth.user) {
            cleanupPageSubscription()
            readSessionRef.current = null
            activeArticleIdRef.current = ""
            return
        }

        const nextArticleId = articleIds[currentIndex] ?? ""
        if (!nextArticleId) return

        if (activeArticleIdRef.current && activeArticleIdRef.current !== nextArticleId) {
            void flushReadSession({ articleId: activeArticleIdRef.current })
        }

        if (activeArticleIdRef.current === nextArticleId) return

        activeArticleIdRef.current = nextArticleId
        cleanupPageSubscription()
        startReadSession(nextArticleId)

        const article = articlesStore.getById(nextArticleId)
        if (!article?.content) return

        pageUnsubscribeRef.current = article.content.subscribePageChanges((pageId) => {
            trackPageVisit(nextArticleId, pageId)
        })
        trackPageVisit(nextArticleId, article.content.currentPageId)
    }, [
        articleIds,
        currentIndex,
        auth.user,
        articlesStore,
        cleanupPageSubscription,
        flushReadSession,
        startReadSession,
        trackPageVisit,
    ])

    useEffect(() => {
        if (!auth.user) return

        const interval = window.setInterval(() => {
            const session = readSessionRef.current
            if (!session) return
            if (document.visibilityState !== "visible") return

            const now = Date.now()
            const delta = Math.max(0, now - session.lastTickAt)
            session.focusMs += delta
            session.lastTickAt = now
            session.lastViewedAt = nowIso()
        }, 1000)

        return () => {
            window.clearInterval(interval)
        }
    }, [auth.user])

    useEffect(() => {
        const onVisibilityChange = () => {
            if (!auth.user) return

            if (document.visibilityState === "hidden") {
                void flushReadSession({ keepalive: true })
                return
            }

            const activeArticleId = activeArticleIdRef.current
            if (!activeArticleId || readSessionRef.current) return
            startReadSession(activeArticleId)
            const pageId = articlesStore.getById(activeArticleId)?.content?.currentPageId ?? ""
            trackPageVisit(activeArticleId, pageId)
        }

        const onPageHide = () => {
            if (!auth.user) return
            void flushReadSession({ keepalive: true })
        }

        const onBeforeUnload = () => {
            if (!auth.user) return
            void flushReadSession({ keepalive: true })
        }

        document.addEventListener("visibilitychange", onVisibilityChange)
        window.addEventListener("pagehide", onPageHide)
        window.addEventListener("beforeunload", onBeforeUnload)

        return () => {
            document.removeEventListener("visibilitychange", onVisibilityChange)
            window.removeEventListener("pagehide", onPageHide)
            window.removeEventListener("beforeunload", onBeforeUnload)
        }
    }, [auth.user, articlesStore, flushReadSession, startReadSession, trackPageVisit])

    useEffect(() => {
        return () => {
            cleanupPageSubscription()
            void flushReadSession({ keepalive: true })
        }
    }, [cleanupPageSubscription, flushReadSession])


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
