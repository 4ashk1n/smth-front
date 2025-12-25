// pages/Feed/ui/index.tsx
import { useContext, useEffect, useRef, useState } from "react"
import VerticalArticleSwipeContainer from "../../../features/FeedNavigation/ui/VerticalArticleSwipeContainer"
import SlidingFeedContent from "../../../features/FeedNavigation/ui/SlidingFeedContent"
import { ARTICLES_FEED } from "../samples/feed.sample"
import ArticleStoreProvider from "../../../entities/article/contexts/article.context"
import ArticleScreen from "../../Article/ui/screen"
import { GlobalContext } from "../../../app/main"

const FeedPage: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [containerHeight, setContainerHeight] = useState(0)
    const containerRef = useRef<HTMLDivElement | null>(null)

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


    if (containerHeight === 0) {
        // можно отрисовать скелетон / ничего, пока не измерили
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
                height: "100%",     // 👈 ровно область под статью, без футера
                overflow: "hidden",
                touchAction: "none",
            }}
        >
            
            <VerticalArticleSwipeContainer
                index={currentIndex}
                maxIndex={ARTICLES_FEED.length - 1}
                onChange={setCurrentIndex}
                height={containerHeight}                // 👈 передаём вниз
                content={(swipeY) => (
                    <SlidingFeedContent
                        swipeY={swipeY}
                        itemsCount={ARTICLES_FEED.length}
                        currentIndex={currentIndex}
                        slideHeight={containerHeight}                // 👈 и сюда
                        renderItem={(idx) => (
                            <ArticleStoreProvider article={ARTICLES_FEED[idx]}>
                                <ArticleScreen />
                            </ArticleStoreProvider>
                        )}
                    />
                )}
            />
        </div>
    )
}

export default FeedPage
