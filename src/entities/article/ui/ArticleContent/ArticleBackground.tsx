import { observer } from "mobx-react-lite"
import { useArticleStore } from "../../contexts/article.context"

const ArticleBackground = observer(() => {
    const { mainCategory } = useArticleStore()
    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                background: `linear-gradient(0deg, ${mainCategory.colors.accentColor}, #000000 80%)`,

                pointerEvents: "none", // 🔥 ОБЯЗАТЕЛЬНО 
            }}
        >
        </div>
    )
})

export default ArticleBackground