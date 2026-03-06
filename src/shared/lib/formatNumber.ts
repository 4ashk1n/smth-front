const LABELS: Record<number, string> = {
    0: '',
    1: ' тыс.',
    2: ' млн.',
    3: ' млрд.',
}

export function formatNumber(num: number) {
    let thousands = 0
    while (num >= 1000) {
        num /= 1000
        thousands++
    }
    return Math.floor(num) + (LABELS[thousands] !== undefined ? LABELS[thousands] : '???')
}