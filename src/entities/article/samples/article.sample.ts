import type { ArticleDTO } from "../types/article.types";

export const ARTICLE_DTO_SAMPLE: ArticleDTO = {
    id: "1",
    title: "Наш слон",
    description: "Мы взяли интервью у Павла Дурова",
    mainCategoryId: "14517b75-44ac-45d9-9d4c-14c9d93aac97",
    categories: ["14517b75-44ac-45d9-9d4c-14c9d93aac97"],
    status: "published",
    authorId: "df0db949-bf41-4596-b14d-0c8ce0ad2424",
    content: {
        articleId: "1",
        topics: [
            {
                id: "topic-1",
                articleId: "1",
                title: "Кто такой Дуров и почему он до сих пор на хайпе?",
                order: 1,
            },
            {
                id: "topic-2",
                articleId: "1",
                title: "Свобода мысли",
                order: 2,
            },
        ],
        pages: [
            { id: "page-1", topicId: "topic-1", order: 1 },
            { id: "page-2", topicId: "topic-1", order: 2 },
            { id: "page-3", topicId: "topic-2", order: 3 },
        ],
        blocks: [
            {
                id: "block-1",
                pageId: "page-1",
                type: "paragraph",
                content: JSON.stringify({
                    time: 0,
                    blocks: [
                        {
                            id: "p1",
                            type: "paragraph",
                            data: { text: "Pavel Durov is more than the founder of VKontakte and Telegram." },
                        },
                    ],
                    version: "2.28.2",
                }),
                object3d: null,
                layout: { i: "block-1", x: 0, y: 1, w: 1, h: 4 },
            },
            {
                id: "block-2",
                pageId: "page-1",
                type: "image",
                url: "https://s0.rbk.ru/v6_top_pics/media/img/5/27/347495348582275.jpeg",
                source: "РБК",
                sourceUrl: null,
                label: "Павел Дуров сидит",
                object3d: {
                    depth: 5,
                    translateX: 0,
                    translateY: 0,
                    translateZ: 3,
                    rotateX: 5,
                    rotateY: 10,
                    rotateZ: 0,
                    scale: 1,
                },
                layout: { i: "block-2", x: 1, y: 1, w: 1, h: 2 },
            },
            {
                id: "block-3",
                pageId: "page-2",
                type: "icon",
                name: "FaTelegram",
                object3d: null,
                layout: { i: "block-3", x: 0, y: 2, w: 2, h: 4 },
            },
            {
                id: "block-4",
                pageId: "page-3",
                type: "icon",
                name: "FaX",
                object3d: {
                    depth: 5,
                    translateX: 0,
                    translateY: 0,
                    translateZ: 3,
                    rotateX: 5,
                    rotateY: 10,
                    rotateZ: 0,
                    scale: 1,
                },
                layout: { i: "block-4", x: 0, y: 2, w: 2, h: 4 },
            },
        ],
    },
} as any;
