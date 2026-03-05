import { makeAutoObservable, ObservableMap } from "mobx";
import type { CategoriesStore } from "../../category/stores/CategoriesStore";
import { ArticleModel } from "../models/article.model";
import type { ArticleDTO } from "../types/article.types";

export class ArticlesStore {
    private readonly categoriesStore: CategoriesStore;

    articles: ObservableMap<string, ArticleModel> = new ObservableMap();
    activeArticleId: string = "";

    constructor(categoriesStore: CategoriesStore) {
        this.categoriesStore = categoriesStore;
        makeAutoObservable(this, {}, { autoBind: true });
        const initialArticle = this.createEmptyArticle();
        this.activeArticleId = initialArticle.id;
    }

    get activeArticle(): ArticleModel {
        const article = this.articles.get(this.activeArticleId);
        if (!article) {
            throw new Error("Active article is not set");
        }
        return article;
    }

    get activeArticleOrUndefined(): ArticleModel | undefined {
        return this.articles.get(this.activeArticleId);
    }

    get list(): ArticleModel[] {
        return Array.from(this.articles.values());
    }

    getById(id: string): ArticleModel | undefined {
        return this.articles.get(id);
    }

    setActiveArticle(id: string) {
        console.log("TRY TO SET ACTIVE ARTICLE", id);
        if (!this.articles.has(id)) {
            throw new Error(`Cannot set active article. Article "${id}" not found`);
        }
        this.activeArticleId = id;
        console.log(this.activeArticle)
    }

    upsertFromDTO(articleDTO: ArticleDTO): ArticleModel {
        const article = this.articles.get(articleDTO.id) ?? new ArticleModel(this.categoriesStore);
        article.fromDTO(articleDTO);
        this.articles.set(article.id, article);
        return article;
    }

    createEmptyArticle(): ArticleModel {
        const article = new ArticleModel(this.categoriesStore);
        article.createEmptyArticle();
        this.articles.set(article.id, article);
        return article;
    }

    removeById(id: string) {
        this.articles.delete(id);
        if (this.activeArticleId === id) {
            this.activeArticleId = "";
        }
    }
}
