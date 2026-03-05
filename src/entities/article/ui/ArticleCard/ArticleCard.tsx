
import type { ArticleMeta } from "../../types/article.types"
import VerticalArticleCard from "./ArticleCard.Vertical"

const ArticleCard: React.FC<{
    variant: 'vertical' | 'horizontal'
    article: ArticleMeta
}> = ({variant, article}) => {

    if (variant === 'vertical') {
        return <VerticalArticleCard article={article} />
    }
    return null
}

export default ArticleCard