import type { Layout } from "react-grid-layout"

export type Object3d = {
    depth: number
    translateX: number
    translateY: number
    translateZ: number
    rotateX: number
    rotateY: number
    rotateZ: number
    scale: number
}

export type BlockBase = {
    id: string
    type: string
    layout: Layout
    object3d?: Object3d
}

export type Icon = BlockBase & {
    type: 'icon',
    name: string,
};

export type Paragraph = BlockBase & {
    type: 'paragraph',
    content: any,
};

export type Image = BlockBase & {
    type: 'image',
    url: string,
    source?: string,
    sourceUrl?: string,
    label?: string,
};

export type Block = Icon | Paragraph | Image
export type BlockType = 'icon' | 'paragraph' | 'image'

export type Page = {
    id: string
    blocks: Block[]
    topicId: string
    order: number
}

export type Topic = {
    id: string 
    pages: Page[]
    order: number
    title: string
}

export type Content = {
    topics: Topic[]
}
