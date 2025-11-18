import ReactIcon, { type IconName } from "../../../../shared/icon/ReactIcon";
import { useArticleStore } from "../../contexts/article.context";
import type { Icon } from "../../types/content.types";
import Object3dBlock from "./Object3dBlock";

const IconBlock: React.FC<{ block: Icon }> = (props) => {

    const { mainCategory } = useArticleStore()

    const Icon2d = () => (<>
        <svg width="1px" height="1px" style={{ position: 'absolute', visibility: 'hidden' }}>
            <linearGradient id="accent-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
                <stop stopColor={mainCategory.colors.lightColor} offset="0%" />
                <stop stopColor={mainCategory.colors.darkColor} offset="100%" />
            </linearGradient>
        </svg>

        <ReactIcon  style={{
            stroke: "url(#accent-gradient)",
            fill: "url(#accent-gradient)",
            overflow: 'visible'
        }} size={'100%'} name={props.block.name as IconName} />
    </>)

    return (<>
        {props.block.object3d ?
            <Object3dBlock blocktype={'icon'} {...props.block.object3d} {...mainCategory.colors}>
                <Icon2d />
            </Object3dBlock>
            : <Icon2d />}
    </>)
}

export default IconBlock