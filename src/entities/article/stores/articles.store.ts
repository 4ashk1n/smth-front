import { makeAutoObservable, ObservableMap } from "mobx";
import type { CategoriesStore } from "../../category/stores/CategoriesStore";
import { ArticleModel } from "../models/article.model";
import type { ArticleDTO } from "../types/article.types";

export class ArticlesStore {
    private readonly categoriesStore: CategoriesStore;

    articles: ObservableMap<string, ArticleModel> = new ObservableMap();

    constructor(categoriesStore: CategoriesStore) {
        this.categoriesStore = categoriesStore;
        makeAutoObservable(this, {}, { autoBind: true });
    }

    get list(): ArticleModel[] {
        return Array.from(this.articles.values());
    }

    getById(id: string): ArticleModel | undefined {
        return this.articles.get(id);
    }

    upsert(article: ArticleModel): ArticleModel {
        this.articles.set(article.id, article);
        return article;
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
    }
}
