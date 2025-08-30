import type { Block } from "./blocks/Block"
import type { Col } from "./blocks/Col"
import type { Icon } from "./blocks/Icon"
import type { Image } from "./blocks/Image"
import type { Paragraph } from "./blocks/Paragraph"

export type BlockTypes = Block | Icon | Image | Paragraph | Col

export type Content = {
    rows: BlockTypes[][]
}