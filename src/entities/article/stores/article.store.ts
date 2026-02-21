import { makeAutoObservable, runInAction } from "mobx";
import { v4 as uuidv4 } from 'uuid';
import { EMPTY_CATEGORY } from "../../category/samples/category.empty";
import type { Category } from "../../category/types/category.types";
import type { User } from "../../user/types/user.types";
import { ARTICLE_EMPTY } from "../samples/article.empty";
import type { ArticleDTO } from "../types/article.types";
import { ContentStore } from "./content.store";

export class ArticleStore {

    id: string = ''
    title: string = ''
    description: string = ''
    mainCategory: Category = { id: '', name: '', emoji: '', colors: { lightColor: '', darkColor: '', accentColor: '' } }
    content: ContentStore = new ContentStore()
    categories: Category[] = []
    author: User = { id: '', username: '', firstname: '', lastname: '', avatar: '' }
    status: 'published' | 'draft' | 'archived' | 'review' | undefined

    editMode: boolean = false
    swiping: boolean = false


    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
        this.content = new ContentStore()
        this.content.setSaveCallback(this.saveLocalDraft)
    }

    fromDTO(article: ArticleDTO) {
        runInAction(() => {
            this.id = article.id
            this.title = article.title
            this.description = article.description
            this.categories = article.categories

            if (article.categories.length > 0) {
                this.mainCategory = article.categories[0]
            } else {
                this.mainCategory = EMPTY_CATEGORY
            }

            this.author = article.author
            this.status = article.status

            this.content.fromDTO(article.content)
        })
    }

    fromJSON(article: any) {
        runInAction(() => {
            console.log("Loading from JSON:", article)
            this.id = article.id
            this.title = article.title
            this.description = article.description
            this.categories = article.categories
            this.mainCategory = article.mainCategory
            this.author = article.author
            this.status = article.status
            this.content.fromJSON(article.content)
        })
    }

    createEmptyArticle() {
        this.fromDTO(ARTICLE_EMPTY)
        this.id = uuidv4()
    }

    setEditMode(editMode: boolean) {
        this.editMode = editMode
        this.content.setEditMode(editMode);

        if (editMode) {
            this.content.addEmptyPage();
        }
    }

    setSwiping(swiping: boolean) {
        this.swiping = swiping
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
        this.saveLocalDraft()
    }

    setTitle(title: string) {
        if (!this.editMode) return
        this.title = title
        this.saveLocalDraft()
    }

    setDescription(description: string) {
        if (!this.editMode) return
        this.description = description
        this.saveLocalDraft()
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            mainCategory: this.mainCategory,
            categories: this.categories,
            author: this.author,
            status: this.status,
            editMode: this.editMode,
            swiping: this.swiping,
            // Сохраняем только данные из ContentStore
            content: this.content.toJSON()
        }
    }

    saveLocalDraft() {
        console.log('Saving draft...')
        const serialized = JSON.stringify(this.toJSON())
        console.log('Before save:', window.localStorage.getItem('articleDraft'))
        window.localStorage.setItem('articleDraft', serialized)
        console.log('After save:', window.localStorage.getItem('articleDraft'))
    }

    loadLocalDraft() {
        const draft = window.localStorage.getItem('articleDraft')
        if (draft) {
            const article = JSON.parse(draft)

            this.content.disableSave()
            try {
                this.fromJSON(article)
            } finally {
                this.content.enableSave()
            }
        }
    }
}