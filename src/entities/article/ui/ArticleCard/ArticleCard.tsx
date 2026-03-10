
import type { ArticleMeta } from "../../types/article.types"
import VerticalArticleCard from "./ArticleCard.Vertical"

const ArticleCard: React.FC<{
    variant: 'vertical' | 'horizontal'
    article: ArticleMeta,
    onClick: () => void
}> = ({variant, article, onClick}) => {

    if (variant === 'vertical') {
        return <VerticalArticleCard article={article} onClick={onClick} />
    }
    return null
}

export default ArticleCard