import type { Icon } from "../../../entities/article/types/blocks/Icon";
import type { Category } from "../../../entities/category/types/Category";
import type { CategoryColors } from "../../../entities/category/types/CategoryColors";
import Object3dBlock from "../../../shared/blocks/Object3dBlock";
import ReactIcon, { type IconName } from "../../../shared/icon/ReactIcon";

const IconBlock: React.FC<{ block: Icon, mainCategory: CategoryColors }> = (props) => {

    const Icon2d = () => (<>
        <svg width="1em" height="1em">
            <linearGradient id="accent-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
                <stop stopColor={props.mainCategory.lightColor} offset="0%" />
                <stop stopColor={props.mainCategory.darkColor} offset="100%" />
            </linearGradient>
        </svg>

        <ReactIcon  style={{
            // border: '1px solid white'
            // background: 'rgba(255, 255, 255, 0.1)'
            stroke: "url(#accent-gradient)",
            fill: "url(#accent-gradient)",
            overflow: 'visible'
        }} size={'100%'} name={props.block.name as IconName} />
    </>)

    return (<>
        {props.block.object3d ?
            <Object3dBlock blocktype={'icon'} {...props.block.object3d} {...props.mainCategory}>
                <Icon2d />
            </Object3dBlock>
            : <Icon2d />}
    </>)
}

export default IconBlock