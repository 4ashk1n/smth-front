import type { Layout } from "react-grid-layout"
import type { Object3d } from "./Object3d"

export type BlockLayout = Layout

export type Block = {
    layout: BlockLayout,
    type: string,
    object3d?: Object3d
}