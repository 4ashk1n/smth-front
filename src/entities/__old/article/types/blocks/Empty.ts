import type { Block } from "./Block"

export type Empty =  Block & {
    type: 'empty'
}