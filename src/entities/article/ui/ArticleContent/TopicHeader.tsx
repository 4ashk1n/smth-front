import { Title } from "@mantine/core";
import { useArticleStore } from "../../contexts/article.context"
import Object3dBlock from "./Object3dBlock";
import { observer } from "mobx-react-lite";
import { useIsMobileScreen } from "../../../../shared/lib/useIsMobile";

const TopicHeader = observer(() => {
    const article = useArticleStore();
    const isMobile = useIsMobileScreen()
    return (
        // <Object3dBlock
        //     blocktype={'icon'}
        //     depth={0}
        //     {...article.mainCategory.colors}
        //     translateX={0}
        //     translateY={0}
        //     translateZ={2}
        //     rotateX={0}
        //     rotateY={0}
        //     rotateZ={0}
        //     scale={1}
            
        // >
        <Title
            order={2}
            fz={'clamp(24px, 7.5vw, 60px)'}
            // fw={700}
            c={article.mainCategory.colors.darkColor}
            lh={0.8}
            mt={10}
            fw={900}
            style={{
                fontVariantCaps: 'small-caps',
                
                // textShadow: `0 0px 16px ${article.mainCategory.colors.lightColor}40`
            }}
        >
            {article.content.currentTopic?.title}
        </Title>
        //  </Object3dBlock>
    )
})

export default TopicHeader