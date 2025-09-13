import { useContext } from "react"
import { ArticleContext } from "../../../features/stores/ArticleStore"
import { observer } from "mobx-react-lite"

const ArticleBackground = observer(() => {
    const { categoryColors } = useContext(ArticleContext)
    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `linear-gradient(0deg, ${categoryColors.accentColor}, #000000 80%)` 
            }}
        >
        </div>
    )
})

export default ArticleBackground