import type { Block } from "./Block";

export type Image = Block & {
    type: 'image',
    url: string,
    source?: string,
    sourceUrl?: string
    label?: string
}

export const ImageEmpty = {
    type: 'image',
    url: '',
    source: '',
    sourceUrl: '',
    label: ''
}