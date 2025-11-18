import type { GetArticleCardDTO } from "smth-shared/src/dto/article.dto"
import ArticleCardCompact from "./ArticleCard.Compact"
import ArticleCardLarge from "./ArticleCard.Large"

type Props = GetArticleCardDTO & {
    variant: 'large' | 'compact'
}

const ArticleCard = (props: Props) => {
    if (props.variant === 'compact') {
        return ArticleCardCompact(props)
    }
    return ArticleCardLarge(props);
}

export default ArticleCard;