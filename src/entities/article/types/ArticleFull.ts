import type { Content } from "./Content"

export type ArticleFull = {
    id: number,
    title: string,
    description: string,
    mainCategory: {
        id: number,
        emoji: string,
        name: string,
        accentColor: string,
        darkColor: string,
        lightColor: string,
    },
    categories: {
        id: number,
        emoji: string,
        name: string,
    }[],
    cover: string,
    status: string,
    author: {
        id: number,
        firstname: string,
        lastname: string,
        username: string,
        avatar: string,
    },
    createdAt: string,
    updatedAt: string,
    publishedAt: string,
    content: Content
}