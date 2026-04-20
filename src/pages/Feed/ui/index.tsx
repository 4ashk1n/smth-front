// pages/Feed/ui/index.tsx
import { type ArticleListResponse, type ArticleMeta } from "@smth/shared"
import { useEffect, useRef, useState } from "react"
import { ArticleScopeProvider, ArticlesProvider } from "../../../entities/article/contexts/article.context"
import { ArticleModel } from "../../../entities/article/models/article.model"
import { ArticlesStore } from "../../../entities/article/stores/articles.store"
import { useCategoriesStore } from "../../../entities/category/contexts/categories.context"
import SlidingFeedContent from "../../../features/FeedNavigation/ui/SlidingFeedContent"
import VerticalArticleSwipeContainer from "../../../features/FeedNavigation/ui/VerticalArticleSwipeContainer"
import { apiRequest } from "../../../shared/api"
import ArticleScreen from "../../Article/ui/screen"

const FeedPage: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [containerHeight, setContainerHeight] = useState(0)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const categories = useCategoriesStore()
    const [articlesStore] = useState(() => new ArticlesStore(categories))
    const [articleIds, setArticleIds] = useState<string[]>([])

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

    useEffect(() => {
        (async () => {
            const res = await apiRequest<ArticleListResponse>('/articles?limit=10&status=published', {method: 'GET'})
            const ids = res.data.items.map((item: ArticleMeta) => {
                const existing = articlesStore.getById(item.id)
                const article = existing ?? new ArticleModel(categories)
                article.fromMetaDTO(item)
                articlesStore.upsert(article)
                article.fetchContent()
                return article.id
            })
            setArticleIds(ids)
            
        })()
    }, [articlesStore, categories])


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
