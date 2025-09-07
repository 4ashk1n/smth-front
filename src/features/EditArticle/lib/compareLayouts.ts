import type { BlockLayout } from "../../../entities/article/types/blocks/Block";

export function compareLayouts(layout1: BlockLayout, layout2: BlockLayout) {
    return layout1.i === layout2.i && layout1.x === layout2.x && layout1.y === layout2.y && layout1.w === layout2.w && layout1.h === layout2.h
}