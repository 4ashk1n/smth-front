import type { Layout } from "react-grid-layout";
import type { Block as BlockBase, Icon, Image, Object3d, Page, Paragraph, Topic } from "../types/content.types";

abstract class BlockBaseModel {
    id: string = '';
    pageId: string = '';
    type: string = '';
    layout: Layout;
    object3d: Object3d | null = null;
    

    constructor(block: BlockBase) {
        this.id = block.id;
        this.pageId = block.pageId;
        this.type = block.type;
        this.layout = block.layout;
        this.object3d = block.object3d;
    }

    static get empty(): BlockBaseModel {
        return {
            id: '',
            pageId: '',
            type: '',
            layout: {
                x: 0,
                y: 0,
                w: 1,
                h: 1,
                i: ''
            },
            object3d: null
        }
    }
}

export class ParagraphModel extends BlockBaseModel {
    type: 'paragraph' = 'paragraph';
    content: {
        blocks: any[];
    };

    constructor(paragraph: Paragraph) {
        super(paragraph);
        this.content = JSON.parse(paragraph.content);
    }

    static get empty(): Paragraph {
        return {
            ...BlockBaseModel.empty,
            type: 'paragraph',
            content: '',
        }
    }
}

export class IconModel extends BlockBaseModel {
    type: 'icon' = 'icon';
    name: string = '';

    constructor(icon: Icon) {
        super(icon);
        this.name = icon.name;
    }

    static get empty(): Icon {
        return {
            ...BlockBaseModel.empty,
            type: 'icon',
            name: '',
        }
    }
}

export class ImageModel extends BlockBaseModel {
    type: 'image' = 'image';
    url: string = '';
    source: string | null = null;
    sourceUrl: string | null = null;
    label: string | null = null;

    constructor(image: Image) {
        super(image);
        this.url = image.url;
        this.source = image.source;
        this.sourceUrl = image.sourceUrl;
        this.label = image.label;
    }

    static get empty(): Image {
        return {
            ...BlockBaseModel.empty,
            type: 'image',
            url: '',
            source: '',
            sourceUrl: '',
            label: ''
        }
    }
}

export class PageModel {
    id: string = '';
    topicId: string = '';
    order: number = 0;
    blocks: BlockBaseModel[] = [];

    constructor(page: Page, blocks: BlockBaseModel[]) {
        this.id = page.id;
        this.topicId = page.topicId;
        this.order = page.order;
        this.blocks = blocks.filter(b => b.pageId === page.id);
    }

    static get empty(): PageModel {
        return {
            id: '',
            topicId: '',
            order: 0,
            blocks: []
        }
    }
}

export class TopicModel {
    id: string = '';
    order: number = 0;
    title: string = '';
    articleId: string = '';
    pages: PageModel[] = [];

    constructor(topic: Topic, pages: PageModel[]) {
        this.id = topic.id;
        this.order = topic.order;
        this.title = topic.title;
        this.articleId = topic.articleId;
        this.pages = pages.filter(p => p.topicId === topic.id);
    }
}
