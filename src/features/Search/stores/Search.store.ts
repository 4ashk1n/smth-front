import { makeAutoObservable } from "mobx";
import type { ArticleMeta, Category, UserMeta } from "@smth/shared";
import { searchArticles } from "../api/searchArticles";
import { searchCategories } from "../api/searchCategories";
import { searchUsers } from "../api/searchUsers";

export type SearchTab = 'articles' | 'users' | 'categories';
type SearchTabState<T> = {
    results: T[],
    query: string,
    loaded: boolean,
    loading: boolean,
    loadingMore: boolean,
    page: number,
    limit: number,
    total: number,
    hasMore: boolean
};
export type SearchResults = {
    articles: SearchTabState<ArticleMeta>,
    users: SearchTabState<UserMeta>,
    categories: SearchTabState<Category>
};

const SEARCH_PAGE_LIMITS: Record<SearchTab, number> = {
    articles: 12,
    users: 20,
    categories: 20,
};

function createTabState<T>(limit: number): SearchTabState<T> {
    return {
        results: [],
        query: '',
        loaded: false,
        loading: false,
        loadingMore: false,
        page: 0,
        limit,
        total: 0,
        hasMore: false,
    };
}

export class SearchStore {
    query: string = '';
    hasSearched: boolean = false;
    currentTab: SearchTab = 'articles';

    results: SearchResults = {
        articles: createTabState<ArticleMeta>(SEARCH_PAGE_LIMITS.articles),
        users: createTabState<UserMeta>(SEARCH_PAGE_LIMITS.users),
        categories: createTabState<Category>(SEARCH_PAGE_LIMITS.categories),
    };


    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    get allowedTabs(): SearchTab[] {
        return ['articles', 'users', 'categories'];
    }

    setCurrentTab(tab: SearchTab) {
        if (!this.allowedTabs.includes(tab)) return;
        if (this.currentTab === tab) return;
        this.currentTab = tab;
        if (this.hasSearched && this.searchAllowed) {
            void this.search();
        }
    }

    setQuery(query: string) {
        this.query = query;
    }

    private setInitialLoading(tab: SearchTab, value: boolean) {
        this.results[tab].loading = value;
    }

    private setLazyLoading(tab: SearchTab, value: boolean) {
        this.results[tab].loadingMore = value;
    }

    get searchAllowed(): boolean {
        return this.query.trim().length >= 3;
    }

    get loading(): boolean {
        return this.results[this.currentTab].loading;
    }

    private async requestTabPage(tab: SearchTab, query: string, page: number) {
        const limit = this.results[tab].limit;

        switch (tab) {
            case 'articles':
                return searchArticles(query, page, limit);
            case 'users':
                return searchUsers(query, page, limit);
            case 'categories':
                return searchCategories(query, page, limit);
            default:
                return {
                    items: [],
                    total: 0,
                    page,
                    limit,
                    hasMore: false,
                };
        }
    }

    private applyFirstPage<T>(state: SearchTabState<T>, query: string, payload: { items: T[]; total: number; page: number; hasMore: boolean }) {
        state.results = payload.items;
        state.query = query;
        state.loaded = true;
        state.page = payload.page;
        state.total = payload.total;
        state.hasMore = payload.hasMore;
    }

    private appendPage<T>(state: SearchTabState<T>, payload: { items: T[]; total: number; page: number; hasMore: boolean }) {
        state.results = [...state.results, ...payload.items];
        state.page = payload.page;
        state.total = payload.total;
        state.hasMore = payload.hasMore;
    }

    getSearchTabName(key: SearchTab): string {
        switch (key) {
            case 'articles':
                return 'Статьи';
            case 'users':
                return 'Авторы';
            case 'categories':
                return 'Категории';
            default:
                return '';
        }
    }


    async search() {
        const tab = this.currentTab;
        const query = this.query.trim();
        const tabState = this.results[tab];

        if (!this.searchAllowed || tabState.loading || tabState.loadingMore) return;
        this.hasSearched = true;
        if (tabState.query === query && tabState.loaded) return;

        this.setInitialLoading(tab, true);
        try {
            const payload = await this.requestTabPage(tab, query, 1);
            this.applyFirstPage(tabState as SearchTabState<typeof payload.items[number]>, query, payload);
        } finally {
            this.setInitialLoading(tab, false);
        }
    }

    async loadMore() {
        const tab = this.currentTab;
        const query = this.query.trim();
        const tabState = this.results[tab];

        if (!this.searchAllowed || !tabState.loaded || tabState.query !== query) return;
        if (!tabState.hasMore || tabState.loading || tabState.loadingMore) return;

        this.setLazyLoading(tab, true);
        try {
            const payload = await this.requestTabPage(tab, query, tabState.page + 1);
            this.appendPage(tabState as SearchTabState<typeof payload.items[number]>, payload);
        } finally {
            this.setLazyLoading(tab, false);
        }
    }
}

export const searchStore = new SearchStore();
