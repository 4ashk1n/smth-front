export type CategoryColors = {
    lightColor: string
    darkColor: string
    accentColor: string
}

export interface Category {
    id: string
    name: string
    emoji: string
    colors: CategoryColors
}