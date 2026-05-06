import type { ArticleDTO } from "../types/article.types";

export const ARTICLE_DTO_SAMPLE_2: ArticleDTO = {
    id: "2",
    title: "Наш слон 2",
    description: "Продолжение интервью у Павла Дурова",
    mainCategoryId: "14517b75-44ac-45d9-9d4c-14c9d93aac97",
    categories: ["14517b75-44ac-45d9-9d4c-14c9d93aac97"],
    status: "published",
    authorId: "df0db949-bf41-4596-b14d-0c8ce0ad2424",
    content: {
        articleId: "2",
        topics: [
            {
                id: "topic-21",
                articleId: "2",
                title: "Новая глава",
                order: 1,
            },
        ],
        pages: [
            { id: "page-21", topicId: "topic-21", order: 1 },
            { id: "page-22", topicId: "topic-21", order: 2 },
        ],
        blocks: [
            {
                id: "block-21",
                pageId: "page-21",
                type: "paragraph",
                content: JSON.stringify({
                    time: 0,
                    blocks: [
                        {
                            id: "p21",
                            type: "paragraph",
                            data: { text: "Во второй части разговора мы обсудили принципы приватности." },
                        },
                    ],
                    version: "2.28.2",
                }),
                object3d: null,
                layout: { i: "block-21", x: 0, y: 1, w: 2, h: 3 },
            },
            {
                id: "block-22",
                pageId: "page-22",
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
                layout: { i: "block-22", x: 0, y: 2, w: 2, h: 4 },
            },
        ],
    },
} as any;
