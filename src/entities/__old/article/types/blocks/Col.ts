import type { BlockTypes } from "../Content"
import type { Block } from "./Block"

export type Col = Block & {
    type: 'col'
    children: BlockTypes[]
}