import { observer } from "mobx-react"
import DarkGradientBackground from "../../../../shared/ui/blocks/DarkGradientBackground"
import { EMPTY_CATEGORY } from "../../../category/samples/category.empty"
import type { Category } from "../../../category/types/category.types"
import { useArticleStore } from "../../contexts/article.context"

const ArticleBackground: React.FC<{
    mainCategory?: Category
}> = observer(({ mainCategory }) => {
    if (!mainCategory) try {
        mainCategory = useArticleStore().mainCategory
    } catch {
        mainCategory = EMPTY_CATEGORY
    }
    return (
        <DarkGradientBackground accentColor={mainCategory.colors.accentColor} />
    )
})

export default ArticleBackground