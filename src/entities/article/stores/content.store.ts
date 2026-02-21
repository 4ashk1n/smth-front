import { makeAutoObservable, ObservableMap, runInAction } from "mobx";
import type { Layout } from "react-grid-layout";
import { v4 as uuidv4 } from 'uuid';
import { findOptimalFreeSpot } from "../../../features/EditArticle/lib/findOptimalFreeSpot";
import type { Block, BlockType, Content, Icon, Image, Page, Paragraph, Topic } from "../types/content.types";

export class ContentStore {
    private saveCallback: (() => void) | null = null
    private saveEnabled: boolean = true

    topics: ObservableMap<string, Topic> = new ObservableMap();
    pages: ObservableMap<string, Page> = new ObservableMap();
    blocks: ObservableMap<string, Block> = new ObservableMap();

    editMode: boolean = false
    dragMode: boolean = false

    currentPageId: string = ''
    currentTopicId: string = ''
    currentBlockId: string = ''

    isDragging: boolean = false
    currentDragPos: { x: number, y: number } = { x: 0, y: 0 }

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    fromDTO(content: Content) {
        // Группируем все изменения в одну транзакцию
        runInAction(() => {
            this.topics.clear()
            this.pages.clear()
            this.blocks.clear()

            // Заполняем данные
            content.topics.forEach(t => this.topics.set(t.id, t))
            content.topics.forEach(t =>
                t.pages.forEach(p => this.pages.set(p.id, p))
            )
            content.topics.forEach(t =>
                t.pages.forEach(p =>
                    p.blocks.forEach(b => this.blocks.set(b.id, b))
                )
            )

            // Добавляем обложку
            this.topics.set('cover', {
                id: 'cover',
                pages: [{ id: 'cover', topicId: '-1', blocks: [], order: 0 }],
                order: 0,
                title: 'cover'
            })
            this.pages.set('cover', {
                id: 'cover',
                topicId: 'cover',
                blocks: [],
                order: 0
            })

            // Устанавливаем текущие страницы
            if (content.topics.length > 0 && content.topics[0].pages.length > 0) {
                this.currentPageId = content.topics[0].pages[0].id
                this.currentTopicId = content.topics[0].id
            }
        })
    }

    toJSON() {
        return {
            // Преобразуем ObservableMap в массив пар ключ-значение
            topics: Array.from(this.topics.entries()),
            pages: Array.from(this.pages.entries()),
            blocks: Array.from(this.blocks.entries()),
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

        // Отключаем сохранение на время загрузки
        const wasSaveEnabled = this.saveEnabled
        this.saveEnabled = false

        try {
            runInAction(() => {
                // Очищаем существующие данные
                this.topics.clear()
                this.pages.clear()
                this.blocks.clear()

                // Восстанавливаем из данных
                const topics = content.topics ?? []
                const pages = content.pages ?? []
                const blocks = content.blocks ?? []

                // Заполняем мапы
                topics.forEach(([id, topic]: [string, Topic]) => {
                    if (topic && id) {
                        this.topics.set(id, topic)
                    }
                })

                pages.forEach(([id, page]: [string, Page]) => {
                    if (page && id) {
                        this.pages.set(id, page)
                    }
                })

                blocks.forEach(([id, block]: [string, Block]) => {
                    if (block && id) {
                        this.blocks.set(id, block)
                    }
                })

                // Восстанавливаем остальные поля
                this.editMode = content.editMode ?? false
                this.dragMode = content.dragMode ?? false
                this.currentPageId = content.currentPageId ?? ''
                this.currentTopicId = content.currentTopicId ?? ''
                this.currentBlockId = content.currentBlockId ?? ''
                this.isDragging = content.isDragging ?? false
                this.currentDragPos = content.currentDragPos ?? { x: 0, y: 0 }

                if (this.editMode) this.clearExtraEmptyPages()
            })
        } finally {
            // Восстанавливаем флаг сохранения
            this.saveEnabled = wasSaveEnabled
        }

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
        return Array.from(this.pages.values()).sort((a, b) => a.order - b.order);
    }

    get coverBlock(): Image | Icon {
        const blocks_values = this.blocks.values()
        const images_and_icons = Array.from(blocks_values).filter(b => b.type === 'image' || b.type === 'icon')
        if (images_and_icons.length === 0) return { id: '', type: 'icon', name: 'MdQuestionMark', layout: { i: '', x: 0, y: 0, w: 1, h: 1 } }

        const chosen_block = images_and_icons[Math.floor(Math.random() * images_and_icons.length)]

        if (chosen_block.type === 'image') return {
            id: chosen_block.id,
            type: 'image',
            url: chosen_block.url,
            layout: { i: '', x: 0, y: 0, w: 1, h: 1 }
        }
        return {
            id: chosen_block.id,
            type: 'icon',
            name: chosen_block.name,
            layout: { i: '', x: 0, y: 0, w: 1, h: 1 }
        }
    }

    getPageByOrder(order: number): Page | undefined {
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
        this.currentPageId = pageId
        this.currentTopicId = this.pages.get(pageId)?.topicId ?? ''

        if (this.editMode) this.clearExtraEmptyPages()

        if (
            this.editMode &&
            this.currentPage?.order === this.pagesData.length - 1 &&
            (this.currentPage?.blocks.length !== 0 || this.currentPage?.topicId === 'cover')
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



    addNewTopic(): Topic | null {
        if (!this.editMode) return null

        const newTopicId = uuidv4()
        const newTopic: Topic = { id: newTopicId, pages: [], order: this.topicsData.length, title: '' }
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
            p.topicId !== 'cover' &&
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
    }

    addEmptyPage(): Page | null {
        if (!this.editMode) return null
        // TODO: Выбор топика (старый или новый)
        const newPageId = uuidv4()
        let prevTopic = this.getPageByOrder(this.pagesData.length - 1)?.topicId
        console.log(prevTopic)
        if (!prevTopic || prevTopic === 'cover' || prevTopic === '') {
            const newTopic = this.addNewTopic()
            if (!newTopic) return null
            prevTopic = newTopic.id
            console.log(prevTopic)
        }
        const newPage: Page = { id: newPageId, blocks: [], topicId: prevTopic, order: this.pagesData.length }
        this.pages.set(newPageId, newPage)
        this.topics.get(prevTopic)?.pages.push(newPage)
        console.log('ADD EMPTY PAGE', newPage, 'TO', prevTopic)

        return newPage
    }

    addBlockToCurrentPage(block: Block) {
        if (!this.currentPage || !this.editMode) return
        this.currentPage.blocks.push(block)

        if (this.currentPage.order === this.pagesData.length - 1) {
            this.addEmptyPage();
        }

        this.triggerSave()
    }

    addEmptyBlock(blocktype: BlockType) {
        if (!this.currentPage || !this.editMode) return

        const { x, y } = findOptimalFreeSpot(this.currentPage);
        if (x === -1 || y === -1) return

        const newBlockId = uuidv4();

        switch (blocktype) {
            case 'image': {
                const newBlock: Image = {
                    id: newBlockId,
                    type: 'image',
                    url: '',
                    layout: { i: newBlockId, x, y, w: 1, h: 2 }
                };
                this.addBlockToCurrentPage(newBlock);
                break;
            }
            case 'icon': {
                const newBlock: Icon = {
                    id: newBlockId,
                    type: 'icon',
                    name: '',
                    layout: { i: newBlockId, x, y, w: 1, h: 2 }
                };
                this.addBlockToCurrentPage(newBlock);
                break;
            }
            case 'paragraph': {
                const newBlock: Paragraph = {
                    id: newBlockId,
                    type: 'paragraph',
                    content: {
                        blocks: [],
                    },
                    layout: { i: newBlockId, x, y, w: 1, h: 2 }
                };
                this.addBlockToCurrentPage(newBlock);
                break;
            }
            default: {
                break;
            }
        }
    }

    editBlock(block: Block) {
        if (!this.currentPage || !this.editMode) return
        const index = this.currentPage.blocks.findIndex(b => b.id === block.id)
        if (index === -1) return
        this.currentPage.blocks[index] = block

        this.triggerSave()
    }

    deleteBlock(blockId: string) {
        if (!this.currentPage || !this.editMode) return
        this.currentPage.blocks = this.currentPage.blocks.filter(b => b.id !== blockId)

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
            this.editBlock({ ...b, layout: blockLayout })
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
