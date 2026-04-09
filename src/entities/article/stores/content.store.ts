import { makeAutoObservable, ObservableMap, runInAction } from "mobx";
import type { Layout } from "react-grid-layout";
import { v4 as uuidv4 } from 'uuid';
import { findOptimalFreeSpot } from "../../../features/EditArticle/lib/findOptimalFreeSpot";
import { IconModel, ImageModel, PageModel, ParagraphModel, TopicModel } from "../models/content.models";
import type { BlockType, BlockUnion, Content, Icon, Image, Page, Paragraph, Topic } from "../types/content.types";

export class ContentStore {
    private static readonly COVER_ID = "cover"

    private saveCallback: (() => void) | null = null
    private saveEnabled: boolean = true

    articleId: string = ''

    topics: ObservableMap<string, TopicModel> = new ObservableMap();
    pages: ObservableMap<string, PageModel> = new ObservableMap();
    blocks: ObservableMap<string, ParagraphModel | IconModel | ImageModel> = new ObservableMap();

    editMode: boolean = false
    dragMode: boolean = false

    currentPageId: string = ''
    currentTopicId: string = ''
    currentBlockId: string = ''

    isDragging: boolean = false
    currentDragPos: { x: number, y: number } = { x: 0, y: 0 }

    isLoaded: boolean = false

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    private normalizeDraftItems<T>(items: unknown): T[] {
        if (!Array.isArray(items)) return [];
        if (items.length === 0) return [];

        // Legacy format: [ [id, entity], ... ]
        if (Array.isArray(items[0])) {
            return (items as Array<[string, T]>)
                .map(([, entity]) => entity)
                .filter(Boolean);
        }

        return items as T[];
    }

    fromDTO(content: Content) {
        runInAction(() => {
            this.topics.clear()
            this.pages.clear()
            this.blocks.clear()

            this.articleId = content.articleId


            content.blocks.forEach(b => this.blocks.set(b.id,
                b.type === 'paragraph' ? new ParagraphModel(b as Paragraph) :
                    b.type === 'icon' ? new IconModel(b as Icon) : new ImageModel(b as Image)
            ))
            content.pages.forEach(p => this.pages.set(p.id, new PageModel(p, Array.from(this.blocks.values()))))
            content.topics.forEach(t => this.topics.set(t.id, new TopicModel(t, Array.from(this.pages.values()))))


            this.topics.set(ContentStore.COVER_ID, new TopicModel({ id: ContentStore.COVER_ID, title: ContentStore.COVER_ID, order: 0, articleId: content.articleId }, []))
            this.pages.set(ContentStore.COVER_ID, new PageModel({ id: ContentStore.COVER_ID, topicId: ContentStore.COVER_ID, order: 0 }, []))

            this.currentPageId = ContentStore.COVER_ID
            this.currentTopicId = ContentStore.COVER_ID

            this.isLoaded = true
        })
    }

    syncArticleId(articleId: string) {
        runInAction(() => {
            this.articleId = articleId
            this.topics.forEach((topic) => {
                topic.articleId = articleId
            })
        })
    }

    toDTO(): Content {
        const topics = this.topicsData
            .filter((topic) => topic.id !== ContentStore.COVER_ID)
            .map((topic) => ({
                id: topic.id,
                articleId: topic.articleId,
                title: topic.title,
                order: topic.order,
            }))
            .sort((a, b) => a.order - b.order);

        const pages = this.pagesData
            .filter((page) => page.id !== ContentStore.COVER_ID && page.topicId !== ContentStore.COVER_ID)
            .map((page) => ({
                id: page.id,
                topicId: page.topicId,
                order: page.order,
            }))
            .sort((a, b) => a.order - b.order);

        const blocks = Array.from(this.blocks.values())
            .filter((block) => block.pageId !== ContentStore.COVER_ID)
            .map((block) => {
                if (block.type === 'paragraph') {
                    return { ...block, content: JSON.stringify(block.content) };
                }
                return block;
            });

        return {
            articleId: this.articleId,
            topics,
            pages,
            blocks
        }
    }

    toJSON() {
        const dto = this.toDTO();
        return {
            version: 2,
            articleId: dto.articleId,
            topics: dto.topics,
            pages: dto.pages,
            blocks: dto.blocks,
            editMode: this.editMode,
            dragMode: this.dragMode,
            currentPageId: this.currentPageId,
            currentTopicId: this.currentTopicId,
            currentBlockId: this.currentBlockId,
            isDragging: this.isDragging,
            currentDragPos: this.currentDragPos
        }
    }

    fromJSON(content: any) {
        if (typeof content !== 'object' || content === null) {
            throw new Error('Invalid JSON')
        }

        const wasSaveEnabled = this.saveEnabled
        this.saveEnabled = false

        try {
            const topics = this.normalizeDraftItems<Topic>(content.topics);
            const pages = this.normalizeDraftItems<Page>(content.pages);
            const blocks = this.normalizeDraftItems<BlockUnion>(content.blocks).map((block) => {
                if (!block || block.type !== "paragraph") return block;
                if (typeof (block as Paragraph).content === "string") return block;
                return {
                    ...block,
                    content: JSON.stringify((block as any).content ?? { blocks: [] }),
                } as Paragraph;
            });

            this.fromDTO({
                articleId: content.articleId ?? this.articleId,
                topics,
                pages,
                blocks,
            });

            runInAction(() => {
                this.editMode = content.editMode ?? this.editMode
                this.dragMode = content.dragMode ?? false
                this.currentBlockId = content.currentBlockId ?? ''
                this.isDragging = content.isDragging ?? false
                this.currentDragPos = content.currentDragPos ?? { x: 0, y: 0 }

                const requestedPageId = typeof content.currentPageId === "string" ? content.currentPageId : ContentStore.COVER_ID;
                this.currentPageId = this.pages.has(requestedPageId) ? requestedPageId : ContentStore.COVER_ID;

                const requestedTopicId = typeof content.currentTopicId === "string" ? content.currentTopicId : this.pages.get(this.currentPageId)?.topicId;
                this.currentTopicId = (requestedTopicId && this.topics.has(requestedTopicId))
                    ? requestedTopicId
                    : (this.pages.get(this.currentPageId)?.topicId ?? ContentStore.COVER_ID);

                this.isLoaded = true

                if (this.editMode) this.clearExtraEmptyPages()
            })
        } finally {
            this.saveEnabled = wasSaveEnabled
        }

    }


    get currentTopic(): TopicModel | undefined {
        return this.topics.get(this.currentTopicId) ?? undefined;
    }

    get currentPage(): PageModel | undefined {
        return this.pages.get(this.currentPageId) ?? undefined;
    }

    get topicsData(): TopicModel[] {
        const coverTopic = this.topics.get(ContentStore.COVER_ID);
        if (!coverTopic) return Array.from(this.topics.values());
        return [coverTopic, ...Array.from(this.topics.values()).filter(t => t.id !== ContentStore.COVER_ID)];
    }

    get pagesData(): PageModel[] {
        return Array.from(this.pages.values()).sort((a, b) => a.order - b.order);
    }

    get coverBlock(): ImageModel | IconModel {
        const blocks_values = this.blocks.values()
        const images_and_icons = Array.from(blocks_values).filter(b => b.type === 'image' || b.type === 'icon')
        if (images_and_icons.length === 0) return new IconModel({
            id: '',
            type: 'icon',
            name: 'MdQuestionMark',
            layout: { i: '', x: 0, y: 0, w: 1, h: 1 },
            pageId: ContentStore.COVER_ID,
            object3d: null
        })

        const chosen_block = images_and_icons[Math.floor(Math.random() * images_and_icons.length)]

        return chosen_block
    }

    getPageByOrder(order: number): PageModel | undefined {
        return this.pagesData.find((p) => p.order === order);
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
        if (!pageId || !this.pages.has(pageId)) return
        this.currentPageId = pageId
        this.currentTopicId = this.pages.get(pageId)?.topicId ?? ''

        if (this.editMode) this.clearExtraEmptyPages()

        if (
            this.editMode &&
            this.currentPage?.order === this.pagesData.length - 1 &&
            (this.currentPage?.blocks.length !== 0 || this.currentPage?.topicId === ContentStore.COVER_ID)
        ) {
            this.addEmptyPage()
        }
    }

    changeTopic(topicId: string) {
        this.currentTopicId = topicId
        this.currentPageId = this.topics.get(topicId)?.pages[0].id ?? ''
    }

    setSaveCallback(callback: () => void) {
        this.saveCallback = callback
    }

    disableSave() {
        this.saveEnabled = false
    }

    enableSave() {
        this.saveEnabled = true
    }

    private triggerSave() {
        if (this.saveEnabled && this.saveCallback) {
            this.saveCallback()
        }
    }


    setEditMode(editMode: boolean) {
        this.editMode = editMode

        if (!editMode) return
        const hasEditablePage = this.pagesData.some((page) => page.id !== ContentStore.COVER_ID)
        if (!hasEditablePage) {
            this.addEmptyPage()
        }
    }

    setDragMode(dragMode: boolean) {
        console.log(dragMode, "DRAG")
        if (!this.editMode) {
            this.dragMode = false;
            return
        }
        if (this.dragMode === dragMode) return
        this.dragMode = dragMode
    }



    addNewTopic(): TopicModel | null {
        if (!this.editMode) return null

        const newTopicId = uuidv4()
        const newTopic = new TopicModel({
            id: newTopicId, order: this.topicsData.length, title: `Topic ${this.topicsData.length}`, articleId: this.articleId
        }, [])
        this.topics.set(newTopicId, newTopic)

        return newTopic
    }

    editTopicTitle(topicId: string, title: string) {
        const topic = this.topics.get(topicId)
        if (!topic) return
        topic.title = title
        this.triggerSave()
    }

    clearExtraEmptyPages() {
        const pages = this.pagesData
        const lastPageOrder = pages.length > 0 ? pages[pages.length - 1].order : -1

        const emptyPages = pages.filter(p => (
            p.blocks.length === 0 &&
            p.topicId !== ContentStore.COVER_ID &&
            p.order !== lastPageOrder
        ))
        emptyPages.forEach(p => {
            this.pages.delete(p.id)
            const topic = this.topics.get(p.topicId)
            if (topic) {
                topic.pages = topic.pages.filter(page => page.id !== p.id)
            }
        })

        const emptyTopics = this.topicsData.filter(t => (t.pages.length === 0))
        emptyTopics.forEach(t => this.topics.delete(t.id))

        const orderedTopics = this.topicsData.filter((topic) => topic.id !== ContentStore.COVER_ID).sort((a, b) => a.order - b.order);
        orderedTopics.forEach((topic, index) => { topic.order = index + 1; });

        const orderedPages = this.pagesData.filter((page) => page.id !== ContentStore.COVER_ID).sort((a, b) => a.order - b.order);
        orderedPages.forEach((page, index) => { page.order = index + 1; });
    }

    addEmptyPage(): PageModel | null {
        if (!this.editMode) return null
        // TODO: Выбор топика (старый или новый)
        const newPageId = uuidv4()
        let prevTopic = this.getPageByOrder(this.pagesData.length - 1)?.topicId
        console.log(prevTopic)
        if (!prevTopic || prevTopic === ContentStore.COVER_ID || prevTopic === '') {
            const newTopic = this.addNewTopic()
            if (!newTopic) return null
            prevTopic = newTopic.id
            console.log(prevTopic)
        }
        const maxOrder = this.pagesData.reduce((max, page) => Math.max(max, page.order), 0)
        const newPage = new PageModel({ id: newPageId, topicId: prevTopic, order: maxOrder + 1 }, [])
        this.pages.set(newPageId, newPage)
        this.topics.get(prevTopic)?.pages.push(newPage)
        console.log('ADD EMPTY PAGE', newPage, 'TO', prevTopic)

        return newPage
    }

    addBlockToCurrentPage(block: ParagraphModel | IconModel | ImageModel) {
        if (!this.currentPage || !this.editMode) return
        this.blocks.set(block.id, block)
        this.currentPage.blocks.push(block)

        if (this.currentPage.order === this.pagesData.length - 1) {
            this.addEmptyPage();
        }

        this.triggerSave()
    }

    addEmptyBlock(blocktype: BlockType) {
        if (!this.currentPage || !this.editMode) return

        if (this.currentPage.id === ContentStore.COVER_ID) {
            const firstEditablePage = this.pagesData.find((page) => page.id !== ContentStore.COVER_ID);
            const targetPage = firstEditablePage ?? this.addEmptyPage();
            if (!targetPage) return;
            this.changePage(targetPage.id);
        }

        let page = this.currentPage;
        if (!page) return;

        let { x, y } = findOptimalFreeSpot(page);
        if (x === -1 || y === -1) {
            const newPage = this.addEmptyPage();
            if (!newPage) return;
            this.changePage(newPage.id);
            page = this.currentPage;
            if (!page) return;
            ({ x, y } = findOptimalFreeSpot(page));
            if (x === -1 || y === -1) return;
        }

        const newBlockId = uuidv4();

        switch (blocktype) {
            case 'image': {
                const newBlock = new ImageModel({
                    id: newBlockId,
                    type: 'image',
                    url: '',
                    source: '',
                    sourceUrl: '',
                    label: '',
                    pageId: page.id,
                    object3d: null,
                    layout: { i: newBlockId, x, y, w: 1, h: 2 }
                });
                this.addBlockToCurrentPage(newBlock);
                break;
            }
            case 'icon': {
                const newBlock = new IconModel({
                    id: newBlockId,
                    type: 'icon',
                    name: '',
                    pageId: page.id,
                    object3d: null,
                    layout: { i: newBlockId, x, y, w: 1, h: 2 }
                });
                this.addBlockToCurrentPage(newBlock);
                break;
            }
            case 'paragraph': {
                const newBlock = new ParagraphModel({
                    id: newBlockId,
                    type: 'paragraph',
                    content: '{"blocks": []}',
                    pageId: page.id,
                    object3d: null,
                    layout: { i: newBlockId, x, y, w: 1, h: 2 }
                });
                this.addBlockToCurrentPage(newBlock);
                break;
            }
            default: {
                break;
            }
        }
    }

    editBlock(block: ImageModel | ParagraphModel | IconModel) {
        if (!this.currentPage || !this.editMode) return
        const index = this.currentPage.blocks.findIndex(b => b.id === block.id)
        if (index === -1) return


        if (block.type === 'image' && !block.sourceUrl) {
            block.sourceUrl = null
        }

        this.currentPage.blocks[index] = block
        this.blocks.set(block.id, block)
        this.triggerSave()
    }

    deleteBlock(blockId: string) {
        if (!this.currentPage || !this.editMode) return
        this.currentPage.blocks = this.currentPage.blocks.filter(b => b.id !== blockId)
        this.blocks.delete(blockId)

        if (this.currentPage.blocks.length === 0) {
            // this.clearExtraEmptyPages() - #TO FIX: Rendered fewer hooks than expected
            this.setDragMode(false)
        }

        this.triggerSave()
    }

    changeLayout(layout: Layout[]) {
        if (!this.currentPage || !this.editMode) return
        console.log(layout)

        this.currentPage.blocks.forEach((b) => {
            const blockLayout = layout.find(l => l.i === b.layout.i)
            console.log(b.layout, blockLayout)
            if (!blockLayout) return
            this.editBlock({ ...b as ParagraphModel | ImageModel | IconModel, layout: blockLayout })
        })
    }

    setCurrentBlock(blockId: string) {
        if (!this.currentPage || !this.editMode) return
        this.currentBlockId = blockId
    }

    setIsDragging(isDragging: boolean) {
        this.isDragging = isDragging
    }

    setCurrentDragPos(x: number, y: number) {
        if (!this.currentPage || !this.editMode || !this.dragMode) return
        this.currentDragPos = { x, y }
    }


}
