import type { Object3d } from "./Object3d"

export type Block = {
    span: number,
    type: string,
    object3d?: Object3d
}