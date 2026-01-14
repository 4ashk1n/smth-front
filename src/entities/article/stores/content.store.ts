import type { Block, BlockType, Content, Icon, Image, Page, Paragraph, Topic } from "../types/content.types";
import { makeAutoObservable, ObservableMap } from "mobx";
import { v4 as uuidv4 } from 'uuid';
import type { BlockTypes } from "../../__old/article/types/Content";
import { findOptimalFreeSpot } from "../../../features/EditArticle/lib/findOptimalFreeSpot";
import type { Layout } from "react-grid-layout";

export class ContentStore {
    topics: ObservableMap<string, Topic> = new ObservableMap();
    pages: ObservableMap<string, Page> = new ObservableMap();
    blocks: ObservableMap<string, Block> = new ObservableMap();

    editMode: boolean = false
    dragMode: boolean = false

    currentPageId: string = ''
    currentTopicId: string = ''

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    fromDTO(content: Content) {
        this.topics = new ObservableMap(content.topics.map(t => [t.id, t]));
        this.pages = new ObservableMap(content.topics.flatMap(t => t.pages.map(p => [p.id, p])));
        this.blocks = new ObservableMap(content.topics.flatMap(t => t.pages.flatMap(p => p.blocks.map(b => [b.id, b]))));
        
        this.topics.set('cover', { id: 'cover', pages: [ { id: 'cover', topicId: '-1', blocks: [], order: 0 }], order: 0, title: 'cover' });
        this.pages.set('cover', { id: 'cover', topicId: 'cover', blocks: [], order: 0 });

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
        
        if (
            this.editMode && 
            this.currentPage?.order === this.pagesData.length - 1 && 
            this.currentPage?.blocks.length !== 0
        ) {
            //this.clearExtraEmptyPages()
            this.addEmptyPage()
        }
    }

    changeTopic(topicId: string) {
        this.currentTopicId = topicId
        this.currentPageId = this.topics.get(topicId)?.pages[0].id ?? ''
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

    clearExtraEmptyPages() {
        const emptyPages = this.pagesData.filter(p => (p.blocks.length === 0 && p.topicId !== 'cover' && p.order !== this.pagesData.length - 1 ))
        console.log(emptyPages.map(p => p.order), this.pagesData.length - 1)
        emptyPages.forEach(p => this.pages.delete(p.id))
    }

    addEmptyPage(): Page | null {
        if (!this.editMode) return null

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

        return newPage
    }

    addBlockToCurrentPage(block: Block) {
        if (!this.currentPage || !this.editMode) return
        this.currentPage.blocks.push(block)

        if (this.currentPage.order === this.pagesData.length - 1) {
            this.addEmptyPage();
        }
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
                    name: 'MdQuestionMark',
                    layout: { i: newBlockId, x, y, w: 1, h: 2 }
                };
                this.addBlockToCurrentPage(newBlock);
                break;
            }
            case 'paragraph': {
                const newBlock: Paragraph = {
                    id: newBlockId,
                    type: 'paragraph',
                    content: '',
                    layout: { i: newBlockId, x, y, w: 1, h: 2 }
                };
                this.addBlockToCurrentPage(newBlock);
                break;
            }
            default: {
                break;
            }
        }

        console.log('created')
    }

    editBlock(block: Block) {
        if (!this.currentPage || !this.editMode) return
        const index = this.currentPage.blocks.findIndex(b => b.id === block.id)
        if (index === -1) return
        this.currentPage.blocks[index] = block
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
    
    
}