import type { Block, Content, Page, Topic } from "../types/content.types";
import { makeAutoObservable, ObservableMap } from "mobx";

export class ContentStore {
    topics: ObservableMap<string, Topic> = new ObservableMap();
    pages: ObservableMap<string, Page> = new ObservableMap();
    blocks: ObservableMap<string, Block> = new ObservableMap();

    currentPageId: string = ''
    currentTopicId: string = ''

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    fromDTO(content: Content) {
        this.topics = new ObservableMap(content.topics.map(t => [t.id, t]));
        this.pages = new ObservableMap(content.topics.flatMap(t => t.pages.map(p => [p.id, p])));
        this.blocks = new ObservableMap(content.topics.flatMap(t => t.pages.flatMap(p => p.blocks.map(b => [b.id, b]))));

        this.currentPageId = content.topics[0].pages[0].id
        this.currentTopicId = content.topics[0].id
    }

    get currentTopic(): Topic | undefined {
        return this.topics.get(this.currentTopicId) ?? undefined;
    }

    get currentPage(): Page | undefined {
        return this.pages.get(this.currentPageId) ?? undefined;
    }

    get topicsData(): Topic[] {
        return Array.from(this.topics.values());
    }

    get pagesData(): Page[] {
        console.log(this.pages.size)
        return Array.from(this.pages.values()).sort((a, b) => a.order - b.order);
    }
    
    distanceToCurrentTopic(order: number): number {
        const currentTopicOrder = this.currentTopic?.order ?? 0
        const distance = Math.abs(currentTopicOrder - order)
        return 1 - (distance / this.topicsData.length)
    }

    distanceToCurrentPage(order: number): number {
        const currentPageOrder = this.currentPage?.order ?? 0
        const distance = Math.abs(currentPageOrder - order)
        return 1 - (distance / this.pagesData.length)
    }

    changePage(pageId: string) {
        this.currentPageId = pageId
        this.currentTopicId = this.pages.get(pageId)?.topicId ?? ''
        console.log(this.currentTopicId)
    }

    changeTopic(topicId: string) {
        this.currentTopicId = topicId
        this.currentPageId = this.topics.get(topicId)?.pages[0].id ?? ''
    }

}