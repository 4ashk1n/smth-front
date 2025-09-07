import type { BlockLayout } from "../../../entities/article/types/blocks/Block";
import type { Content } from "../../../entities/article/types/Content";

export function getLayoutForNewBlock(content: Content): BlockLayout {
    const maxRow = Math.max(0, ...content.map(block => block.layout.y + block.layout.h))
    const newId = `${Math.max(0, Math.max(...content.map(block => +block.layout.i)) + 1)}`
    return {
        i: newId,
        x: 0,
        y: maxRow,
        w: 3,
        h: 4,
        minH: 4,
        maxH: 16,
        minW: 2,
        maxW: 12
    }
}