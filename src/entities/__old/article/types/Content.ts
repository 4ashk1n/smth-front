import type { Block } from "./blocks/Block"
import type { Col } from "./blocks/Col"
import type { Empty } from "./blocks/Empty"
import type { Icon } from "./blocks/Icon"
import type { Image } from "./blocks/Image"
import type { Paragraph } from "./blocks/Paragraph"

export type BlockTypes = Block | Icon | Image | Paragraph // | Col | Empty

export type BlockTypesString = 'paragraph' | 'icon' | 'image'

// export type Content = {
//     rows: BlockTypes[][]
// }

export type Content = BlockTypes[]

// export type ArticleRow = BlockTypes[]