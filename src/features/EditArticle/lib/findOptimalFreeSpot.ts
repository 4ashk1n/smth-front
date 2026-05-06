import type { Page } from "../../../entities/article/types/content.types"

type PageWithBlocks = Page & {
    blocks?: Array<{
        layout: {
            x: number
            y: number
            w: number
            h: number
        }
    }>
}


export function findOptimalFreeSpot(page: PageWithBlocks) {
    const existingLayout = (page.blocks ?? []).map(block => block.layout);
    const occupied = Array(8).fill(0).map(() => Array(2).fill(false));

    existingLayout.forEach(item => {
        for (let y = item.y; y < item.y + item.h && y < 8; y++) {
            for (let x = item.x; x < item.x + item.w && x < 2; x++) {
                occupied[y][x] = true;
            }
        }
    });

    // Topic
    occupied[0][0] = true;
    occupied[0][1] = true;

    // Поиск по строкам (сверху вниз) и колонкам (слева направо)
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 2; x++) {
            if (!occupied[y][x]) {
                return { x, y };
            }
        }
    }

    return { x: -1, y: -1 };
}
