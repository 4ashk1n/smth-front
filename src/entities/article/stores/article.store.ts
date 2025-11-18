import type { Article, ArticleDTO, ArticleMeta } from "../types/article.types";
import { makeAutoObservable } from "mobx";
import { ContentStore } from "./content.store";
import type { Category } from "../../category/types/category.types";
import type { User } from "../../user/types/user.types";

export class ArticleStore {
    
    id: string = ''
    title: string = ''
    description: string = ''
    mainCategory: Category = {id: '', name: '', emoji: '', colors: {lightColor: '', darkColor: '', accentColor: ''}}
    content: ContentStore = new ContentStore()
    categories: Category[] = []
    author: User = {id: '', username: '', firstname: '', lastname: '', avatar: ''}
    status: 'published' | 'draft' | 'archived' | 'review' | undefined


    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    fromDTO(article: ArticleDTO) {
        this.id = article.id
        this.title = article.title
        this.description = article.description
        this.mainCategory = article.mainCategory
        this.categories = article.categories
        this.author = article.author
        this.status = article.status

        this.content = new ContentStore()
        this.content.fromDTO(article.content)
    }

    
}