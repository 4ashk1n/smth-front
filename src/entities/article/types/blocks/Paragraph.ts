import type { Block } from "./Block"


export type Paragraph = Block & {
    type: 'paragraph',
    title: string,
    content: string
}