import type { Category } from "../types/category.types";

export const EMPTY_CATEGORY: Category = {
    id: '-1',
    emoji: '',
    name: '',
    colors: {
        accentColor: '#888888',
        darkColor: '#000000',
        lightColor: '#bbbbbb'
    },
    createdAt: new Date(),
    updatedAt: new Date()
}