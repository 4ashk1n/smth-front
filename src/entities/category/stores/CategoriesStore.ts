import { makeAutoObservable, ObservableMap, runInAction } from "mobx"
import { apiRequest } from "../../../shared/api"
import type { Category } from "../types/category.types"

const CATEGORIES_ALL_PATH = "/categories"
const CATEGORY_BY_ID_PATH = (id: string) => `/categories/${id}`

function isCategory(value: unknown): value is Category {
    if (!value || typeof value !== "object") return false
    const candidate = value as Partial<Category>
    return typeof candidate.id === "string"
}

function extractCategories(payload: unknown): Category[] {
    if (Array.isArray(payload)) {
        return payload.filter(isCategory)
    }
    if (!payload || typeof payload !== "object") return []

    const data = payload as {
        categories?: unknown
        data?: unknown
        items?: unknown
        results?: unknown
    }

    const container = data.categories ?? data.data ?? data.items ?? data.results
    if (Array.isArray(container)) {
        return container.filter(isCategory)
    }

    return []
}

function extractCategory(payload: unknown): Category | null {
    if (isCategory(payload)) return payload
    if (!payload || typeof payload !== "object") return null

    const data = payload as {
        category?: unknown
        data?: unknown
    }

    if (isCategory(data.category)) return data.category
    if (isCategory(data.data)) return data.data
    return null
}

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
            let categoriesPayload: unknown
            categoriesPayload = await apiRequest<unknown>(CATEGORIES_ALL_PATH)
            const categories = extractCategories(categoriesPayload)

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
            const categoryPayload = await apiRequest<unknown>(CATEGORY_BY_ID_PATH(id))
            const category = extractCategory(categoryPayload)
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
