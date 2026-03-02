import { makeAutoObservable, runInAction } from "mobx";
import { v4 as uuidv4 } from 'uuid';
import { EMPTY_CATEGORY } from "../../category/samples/category.empty";
import type { CategoriesStore } from "../../category/stores/CategoriesStore";
import type { Category } from "../../category/types/category.types";
import { ARTICLE_EMPTY } from "../samples/article.empty";
import type { ArticleDTO } from "../types/article.types";
import { ContentStore } from "./content.store";

export class ArticleStore {
    private readonly categoriesStore: CategoriesStore

    id: string = ''
    title: string = ''
    description: string = ''
    mainCategoryId: string = ''
    content: ContentStore = new ContentStore()
    categoryIds: string[] = []
    authorId: string = ''
    status: 'published' | 'draft' | 'archived' | 'review' | undefined

    editMode: boolean = false
    swiping: boolean = false


    constructor(categoriesStore: CategoriesStore) {
        this.categoriesStore = categoriesStore
        makeAutoObservable(this, { categoriesStore: false }, { autoBind: true })
        this.content = new ContentStore()
        this.content.setSaveCallback(this.saveLocalDraft)
    }

    get mainCategory(): Category {
        return this.categoriesStore.getById(this.mainCategoryId) ?? EMPTY_CATEGORY
    }

    get categories(): Category[] {
        return this.categoriesStore.getMany(this.categoryIds)
    }

    fromDTO(article: ArticleDTO) {
        runInAction(() => {
            this.id = article.id
            this.title = article.title
            this.description = article.description
            this.categoryIds = article.categories.map((category) => category.id)
            this.mainCategoryId = article.mainCategory?.id ?? this.categoryIds[0] ?? ''

            this.authorId = article.author.id
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
            const rawCategoryIds = Array.isArray(article.categoryIds)
                ? article.categoryIds
                : Array.isArray(article.categories)
                    ? article.categories.map((category: Category | string) => typeof category === "string" ? category : category.id)
                    : []
            this.categoryIds = rawCategoryIds
            this.mainCategoryId =
                article.mainCategoryId ??
                article.mainCategory?.id ??
                this.categoryIds[0] ??
                ''
            this.authorId = article.authorId ?? article.author?.id ?? ''
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

    setCategories(categories: Category[] | string[]) {
        if (!this.editMode) return
        const ids = categories.map((category) => typeof category === "string" ? category : category.id)
        this.setCategoryIds(ids)
    }

    setCategoryIds(categoryIds: string[]) {
        if (!this.editMode) return
        this.categoryIds = Array.from(new Set(categoryIds))
        this.mainCategoryId = this.categoryIds[0] ?? ''
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

    setAuthorId(authorId: string) {
        this.authorId = authorId
        if (this.editMode) {
            this.saveLocalDraft()
        }
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            mainCategoryId: this.mainCategoryId,
            categories: this.categoryIds,
            authorId: this.authorId,
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
