import type {
    Block as SHARED_Block,
    BlockType as SHARED_BlockType,
    Content as SHARED_Content,
    Icon as SHARED_Icon,
    Image as SHARED_Image,
    Object3d as SHARED_Object3d,
    Page as SHARED_Page,
    Paragraph as SHARED_Paragraph,
    Topic as SHARED_Topic
} from "@smth/shared";

export type Object3d = SHARED_Object3d;
export type Block = SHARED_Block;
export type BlockType = SHARED_BlockType;
export type Page = SHARED_Page;
export type Topic = SHARED_Topic;
export type Content = SHARED_Content;
export type Paragraph = SHARED_Paragraph;
export type Image = SHARED_Image;
export type Icon = SHARED_Icon;
export type BlockUnion = Paragraph | Image | Icon;
export type BlockLayout = SHARED_Block['layout'];