import type { ArticleDTO } from "../types/article.types";

export const ARTICLE_EMPTY: ArticleDTO = {
    id: '3',
    title: '',
    description: '',
    categories: [],
    status: 'draft',
    author: {
        id: '1',
        firstname: 'skebob',
        lastname: 'abob',
        username: 'zverinus',
        avatar: 'https://fbi.cults3d.com/uploaders/34973218/illustration-file/46f9a2d8-fb9a-482f-9b9f-8ba3c0701b6d/skiebob.jpg'
    },
    content: {
        articleId: '3',
        topics: [],
        pages: [],
        blocks: []
    }
} as any
