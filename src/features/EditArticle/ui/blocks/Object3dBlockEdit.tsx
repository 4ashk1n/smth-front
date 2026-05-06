// import { useContext, useState } from "react"
// import type { BlockTypes } from "../../../../entities/article/types/Content"
// import Object3dBlock from "../../../../shared/blocks/Object3dBlock"
// import { ArticleContext } from "../../../stores/ArticleStore"
// import Transform3dTooltip from "../archive/Transform3dTooltip"

// const Object3dBlockEdit: React.FC<{
//     block: BlockTypes,
//     children: React.ReactNode
// }> = ({ block, children }) => {

//     const [showTooltip, setShowTooltip] = useState(false)
//     const { categoryColors } = useContext(ArticleContext)

//     if (!block.object3d) return children
//     return (<>
//         <div style={{ position: 'relative', width: '100%', height: '100%' }} onMouseOver={() => { setShowTooltip(true) }} onMouseLeave={() => setShowTooltip(false)} >
//             <Object3dBlock {...block.object3d} {...categoryColors} blocktype={block.type}>
//                 {children}
//             </Object3dBlock>

//             <Transform3dTooltip showTooltip={showTooltip} block={block}  />
//         </div>

//     </>)
// }

// export default Object3dBlockEdit