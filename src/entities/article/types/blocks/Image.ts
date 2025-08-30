import type { Block } from "./Block";

export type Image = Block & {
    type: 'image',
    url: string,
    source?: string,
    soutceUrl?: string
    label?: string
}