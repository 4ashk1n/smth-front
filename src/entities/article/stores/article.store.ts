import type { Article, ArticleDTO, ArticleMeta } from "../types/article.types";
import { makeAutoObservable } from "mobx";
import { ContentStore } from "./content.store";
import type { Category } from "../../category/types/category.types";
import type { User } from "../../user/types/user.types";
import { EMPTY_CATEGORY } from "../../category/samples/category.empty";

export class ArticleStore {
    
    id: string = ''
    title: string = ''
    description: string = ''
    mainCategory: Category = {id: '', name: '', emoji: '', colors: {lightColor: '', darkColor: '', accentColor: ''}}
    content: ContentStore = new ContentStore()
    categories: Category[] = []
    author: User = {id: '', username: '', firstname: '', lastname: '', avatar: ''}
    status: 'published' | 'draft' | 'archived' | 'review' | undefined

    editMode: boolean = false


    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    fromDTO(article: ArticleDTO) {
        this.id = article.id
        this.title = article.title
        this.description = article.description
        this.categories = article.categories

        if (article.categories.length > 0) {
            this.mainCategory = article.categories[0]
        }
        else {
            this.mainCategory = EMPTY_CATEGORY
        }

        this.author = article.author
        this.status = article.status

        this.content = new ContentStore()
        this.content.fromDTO(article.content)
    }

    setEditMode(editMode: boolean) {
        this.editMode = editMode
        this.content.setEditMode(editMode);

        if (editMode) {
            this.content.addEmptyPage();
        }
    }

    setCategories(categories: Category[]) {
        if (!this.editMode) return
        if (categories.length > 0) {
            this.mainCategory = categories[0]
        }
        else {
            this.mainCategory = EMPTY_CATEGORY
        }
        this.categories = categories
    }

    setTitle(title: string) {
        if (!this.editMode) return
        this.title = title
    }

    setDescription(description: string) {
        if (!this.editMode) return
        this.description = description
    }
}