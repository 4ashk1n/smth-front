import type { Layout } from "react-grid-layout";
import type { BlockBase, Icon, Image, Object3d, Page, Paragraph, Topic } from "../types/content.types";

abstract class BlockBaseModel {
    id: string = '';
    type: string = '';
    layout: Layout;
    object3d?: Object3d;

    constructor(block: BlockBase) {
        this.id = block.id;
        this.type = block.type;
        this.layout = block.layout;
        this.object3d = block.object3d;
    }

    static get empty(): BlockBaseModel {
        return {
            id: '',
            type: '',
            layout: {
                x: 0,
                y: 0,
                w: 1,
                h: 1,
                i: ''
            },
            object3d: undefined
        }
    }
}

export class ParagraphModel extends BlockBaseModel {
    type: 'paragraph' = 'paragraph';
    content: string = '';

    constructor(paragraph: Paragraph) {
        super(paragraph);
        this.content = paragraph.content;
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
    source?: string;
    sourceUrl?: string;
    label?: string;

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
    blocks: BlockBaseModel[] = [];
    topicId: string = '';
    order: number = 0;

    constructor(page: Page) {
        this.id = page.id;
        this.blocks = page.blocks.map(b => {
            switch (b.type) {
                case 'paragraph':
                    return new ParagraphModel(b);
                case 'icon':
                    return new IconModel(b);
                case 'image':
                    return new ImageModel(b);
            }
        });
        this.topicId = page.topicId;
        this.order = page.order;
    }

    static get empty(): Page {
        return {
            id: '',
            blocks: [],
            topicId: '',
            order: 0,
        }
    }
}

export class TopicModel {
    id: string = '';
    pages: PageModel[] = [];
    order: number = 0;
    title: string = '';

    constructor(topic: Topic) {
        this.id = topic.id;
        this.pages = topic.pages.map(p => new PageModel(p));
        this.order = topic.order;
        this.title = topic.title;
    }
}
