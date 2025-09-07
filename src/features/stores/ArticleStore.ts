import type { ArticleFull } from "../../entities/article/types/ArticleFull";
import { makeAutoObservable } from "mobx";
import type { BlockTypes, BlockTypesString } from "../../entities/article/types/Content";
import { ArticleFullEmpty } from "../../entities/article/types/ArticleFullEmpty";
import { createContext } from "react";
import { ParagraphEmpty } from "../../entities/article/types/blocks/Paragraph";
import { ImageEmpty } from "../../entities/article/types/blocks/Image";
import { IconEmpty } from "../../entities/article/types/blocks/Icon";
import { getLayoutForNewBlock } from "../EditArticle/lib/getLayoutForNewBlock";
import type { BlockLayout } from "../../entities/article/types/blocks/Block";
import { compareLayouts } from "../EditArticle/lib/compareLayouts";
import type { CategoryColors } from "../../entities/category/types/CategoryColors";

class ArticleStore {
    article: ArticleFull = ArticleFullEmpty

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    setArticle(article: ArticleFull) {
        this.article = article
    }

    editBlock(newBlock: BlockTypes) {
        this.article.content = this.article.content.map(block => block.layout.i === newBlock.layout.i ? newBlock : block)
        // this.needSave = false
    }

    getBlock(i: string) {
        return this.article.content.find(block => block.layout.i === i)
    }

    getArticle() {
        return this.article
    }

    removeBlock(i: string) {
        this.article.content = this.article.content.filter(block => block.layout.i !== i)
    }

    addBlock(block: BlockTypes) {
        this.article.content.push(block)
    }

    createNewBlock(blockType: BlockTypesString) {
        const newBlock = {
            ...(
                blockType === 'paragraph' ?
                    ParagraphEmpty :
                    blockType === 'image' ?
                        ImageEmpty :
                        blockType === 'icon' ?
                            IconEmpty : {}
            ),
            type: blockType,
            layout: getLayoutForNewBlock(this.article.content),
        }
        this.addBlock(newBlock)
    }

    changeLayout(layout: BlockLayout[]) {
        for (const block of this.article.content) {
            const blockLayout = layout.find(l => l.i === block.layout.i)
            if (blockLayout && !compareLayouts(block.layout, blockLayout)) {
                block.layout = blockLayout
                return
            }
        }
    }

    get categoryColors(): CategoryColors {
        return {
            lightColor: this.article.mainCategory.lightColor,
            darkColor: this.article.mainCategory.darkColor,
            accentColor: this.article.mainCategory.accentColor
        }
    }

    toggleBlock3d(i: string) {
        const block = this.getBlock(i)
        if (!block) return
        if (block.object3d) this.editBlock({ ...block, object3d: undefined })
        else this.editBlock({
            ...block,
            object3d: {
                depth: 3,
                translateX: 0,
                translateY: 0,
                translateZ: 0,
                rotateX: 15,
                rotateY: 15,
                rotateZ: 0,
                scale: 1
            }
        })
    }

}

export const articleStore = new ArticleStore();
export const ArticleContext = createContext(articleStore);