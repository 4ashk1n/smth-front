import type { ArticleContentResponse, ArticleMeta } from "@smth/shared";
import { makeAutoObservable, runInAction } from "mobx";
import { v4 as uuidv4 } from "uuid";
import { apiRequest } from "../../../shared/api";
import { EMPTY_CATEGORY } from "../../category/samples/category.empty";
import type { CategoriesStore } from "../../category/stores/CategoriesStore";
import type { Category } from "../../category/types/category.types";
import { ARTICLE_EMPTY } from "../samples/article.empty";
import { ContentStore } from "../stores/content.store";
import type { ArticleDTO } from "../types/article.types";

export class ArticleModel {
    private readonly categoriesStore: CategoriesStore;

    id: string = "";
    title: string = "";
    description: string = "";
    mainCategoryId: string = "";
    content: ContentStore | undefined = undefined;
    categoryIds: string[] = [];
    authorId: string = "";
    status: "published" | "draft" | "archived" | "review" = "archived";

    createdAt: string | Date = "";
    updatedAt: string | Date = "";
    publishedAt: string | Date | null = null;

    editMode: boolean = false;
    swiping: boolean = false;

    constructor(categoriesStore: CategoriesStore) {
        this.categoriesStore = categoriesStore;
        makeAutoObservable(this, {}, { autoBind: true });
        this.content = new ContentStore();
        this.content.setSaveCallback(this.saveLocalDraft);
    }

    get mainCategory(): Category {
        return this.categoriesStore.getById(this.mainCategoryId) ?? EMPTY_CATEGORY;
    }

    get categories(): Category[] {
        return this.categoriesStore.getMany(this.categoryIds);
    }

    private get localDraftKey(): string {
        return `articleDraft:${this.id || "new"}`;
    }

    fromDTO(article: ArticleDTO) {
        runInAction(() => {
            this.id = article.id;
            this.title = article.title;
            this.description = article.description ?? "";
            this.categoryIds = article.categories;
            this.mainCategoryId = article.mainCategoryId

            this.authorId = article.authorId;
            this.status = article.status;

            if (!this.content) {
                this.content = new ContentStore();
            }
            this.content.fromDTO(article.content);

            this.createdAt = article.createdAt;
            this.updatedAt = article.updatedAt;
            this.publishedAt = article.publishedAt;
        });
    }

    fromMetaDTO(articleMeta: ArticleMeta) {
        runInAction(() => {
            this.id = articleMeta.id;
            this.title = articleMeta.title;
            this.description = articleMeta.description ?? "";
            this.categoryIds = articleMeta.categories;
            this.mainCategoryId = articleMeta.mainCategoryId;
            this.authorId = articleMeta.authorId;
            this.status = articleMeta.status;
        });
    }

    fromJSON(article: any) {
        runInAction(() => {
            console.log("Loading from JSON:", article);
            this.id = article.id;
            this.title = article.title;
            this.description = article.description;
            const rawCategoryIds = Array.isArray(article.categoryIds)
                ? article.categoryIds
                : Array.isArray(article.categories)
                    ? article.categories.map((category: Category | string) => typeof category === "string" ? category : category.id)
                    : [];
            this.categoryIds = rawCategoryIds;
            this.mainCategoryId =
                article.mainCategoryId ??
                article.mainCategory?.id ??
                this.categoryIds[0] ??
                "";
            this.authorId = article.authorId ?? article.author?.id ?? "";
            this.status = article.status;

            if (!this.content) {
                this.content = new ContentStore();
            }
            this.content.fromJSON(article.content);
        });
    }

    async fetchContent(): Promise<ContentStore> {
        if (!this.id) {
            throw new Error("Article id is required to fetch content");
        }

        if (this.content && this.content.isLoaded) {
            return this.content;
        }

        const contentPayload = await apiRequest<ArticleContentResponse>(`/articles/${this.id}/content`);

        if (!this.content) {
            this.content = new ContentStore();
        }
        this.content.fromDTO(contentPayload.data);
        return this.content;
    }

    createEmptyArticle() {
        this.fromDTO(ARTICLE_EMPTY);
        this.id = uuidv4();
    }

    setEditMode(editMode: boolean) {
        this.editMode = editMode;
        if (!this.content) {
            this.content = new ContentStore();
        }
        this.content.setEditMode(editMode);

        if (editMode) {
            this.content.addEmptyPage();
        }
    }

    setSwiping(swiping: boolean) {
        this.swiping = swiping;
    }

    setCategories(categories: Category[] | string[]) {
        if (!this.editMode) return;
        const ids = categories.map((category) => typeof category === "string" ? category : category.id);
        this.setCategoryIds(ids);
    }

    setCategoryIds(categoryIds: string[]) {
        if (!this.editMode) return;
        this.categoryIds = Array.from(new Set(categoryIds));
        this.mainCategoryId = this.categoryIds[0] ?? "";
        this.saveLocalDraft();
    }

    setTitle(title: string) {
        if (!this.editMode) return;
        this.title = title;
        this.saveLocalDraft();
    }

    setDescription(description: string) {
        if (!this.editMode) return;
        this.description = description;
        this.saveLocalDraft();
    }

    setAuthorId(authorId: string) {
        this.authorId = authorId;
        if (this.editMode) {
            this.saveLocalDraft();
        }
    }

    toJSON() {
        if (!this.content) {
            this.content = new ContentStore();
        }
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
            content: this.content.toJSON(),
        };
    }

    toDTO(): ArticleDTO {
        if (!this.content) {
            this.content = new ContentStore();
        }
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            mainCategoryId: this.mainCategoryId,
            categories: this.categoryIds,
            authorId: this.authorId,
            status: this.status,
            content: this.content.toDTO(),
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            publishedAt: this.publishedAt
        };
    }


    saveLocalDraft() {
        console.log("Saving draft...");
        const serialized = JSON.stringify(this.toJSON());
        console.log("Before save:", window.localStorage.getItem(this.localDraftKey));
        window.localStorage.setItem(this.localDraftKey, serialized);
        console.log("After save:", window.localStorage.getItem(this.localDraftKey));
    }

    loadLocalDraft() {
        const keyedDraft = window.localStorage.getItem(this.localDraftKey);
        const legacyDraft = window.localStorage.getItem("articleDraft");
        const draft = keyedDraft ?? legacyDraft;

        if (draft) {
            const article = JSON.parse(draft);
            if (!this.content) {
                this.content = new ContentStore();
            }

            this.content.disableSave();
            try {
                this.fromJSON(article);
            } finally {
                this.content.enableSave();
            }
        }
    }
}
