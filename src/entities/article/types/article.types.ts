import type { Category } from "../../category/types/category.types"
import type { User } from "../../user/types/user.types"
import type { Content } from "./content.types"

export type ArticleMeta = {
    id: string 
    title: string
    description: string
    mainCategory: string
    categories: string[]
    author: User
    status: 'published' | 'draft' | 'archived' | 'review'
}

export type Article = ArticleMeta & {
    content: Content
}

export type ArticleDTO = {
    id: string
    title: string
    description: string
    mainCategory: Category
    categories: Category[]
    author: User
    status: 'published' | 'draft' | 'archived' | 'review'
    content: Content
}