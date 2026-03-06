import { observer } from "mobx-react"
import type { Category } from "../../../category/types/category.types"
import { useArticleStore } from "../../contexts/article.context"

const ArticleBackground: React.FC<{
    mainCategory?: Category
}> = observer(({ mainCategory }) => {
    if (!mainCategory) mainCategory = useArticleStore().mainCategory
    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `linear-gradient(0deg, ${mainCategory.colors.accentColor}, #000000 80%)`,

                pointerEvents: "none", // 🔥 ОБЯЗАТЕЛЬНО 
            }}
        >
        </div>
    )
})

export default ArticleBackground