import type { CategoryListResponse, CategoryResponse } from "@smth/shared"
import { makeAutoObservable, ObservableMap, runInAction } from "mobx"
import { apiRequest } from "../../../shared/api"
import type { Category } from "../types/category.types"

const CATEGORIES_ALL_PATH = "/categories"
const CATEGORY_BY_ID_PATH = (id: string) => `/categories/${id}`


export class CategoriesStore {
    categoriesById: ObservableMap<string, Category> = new ObservableMap()
    loading: boolean = false
    loaded: boolean = false
    error: string | null = null

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    get categories(): Category[] {
        return Array.from(this.categoriesById.values())
    }

    getById(id: string): Category | undefined {
        return this.categoriesById.get(id)
    }

    getMany(ids: string[]): Category[] {
        return ids
            .map((id) => this.getById(id))
            .filter((category): category is Category => Boolean(category))
    }

    upsert(category: Category) {
        this.categoriesById.set(category.id, category)
    }

    upsertMany(categories: Category[]) {
        categories.forEach((category) => this.upsert(category))
    }

    async fetchAll(force: boolean = false) {
        if (this.loading) return
        if (this.loaded && !force) return

        this.loading = true
        this.error = null

        try {
            const categoriesPayload = await apiRequest<CategoryListResponse>(CATEGORIES_ALL_PATH)
            const categories = categoriesPayload.data

            runInAction(() => {
                this.categoriesById.clear()
                this.upsertMany(categories)
                this.loaded = true
            })
        } catch (error) {
            runInAction(() => {
                this.error = error instanceof Error ? error.message : "Failed to load categories"
            })
            throw error
        } finally {
            runInAction(() => {
                this.loading = false
            })
        }
    }

    async fetchById(id: string): Promise<Category | null> {
        const existing = this.getById(id)
        if (existing) return existing

        try {
            const categoryPayload = await apiRequest<CategoryResponse>(CATEGORY_BY_ID_PATH(id))
            const category = categoryPayload.data
            if (!category) {
                return null
            }
            runInAction(() => {
                this.upsert(category)
            })
            return category
        } catch {
            return null
        }
    }
}
