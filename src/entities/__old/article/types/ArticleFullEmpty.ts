import type { ArticleFull } from "./ArticleFull";


export const EmptyCategory = {
    id: -1,
    emoji: '',
    name: '',
    accentColor: '#ffffff',
    darkColor: '#000000',
    lightColor: '#ffffff'
}

export const ArticleFullEmpty: ArticleFull = {
    id: -1,
    title: '',
    description: '',
    mainCategory: EmptyCategory,
    // content: { rows: [
    //     [
    //         {
    //             type: 'empty',
    //             span: 1
    //         },
    //         {
    //             type: 'empty',
    //             span: 1
    //         },
    //         {
    //             type: 'empty',
    //             span: 1
    //         },
    //         {
    //             type: 'empty',
    //             span: 1
    //         },
    //         {
    //             type: 'empty',
    //             span: 1
    //         },
    //         {
    //             type: 'empty',
    //             span: 1
    //         },
    //         {
    //             type: 'empty',
    //             span: 1
    //         },
    //         {
    //             type: 'empty',
    //             span: 1
    //         },
    //         {
    //             type: 'empty',
    //             span: 1
    //         },
    //         {
    //             type: 'empty',
    //             span: 1
    //         },
    //         {
    //             type: 'empty',
    //             span: 1
    //         },
    //         {
    //             type: 'empty',
    //             span: 1
    //         },
    //     ]
    // ] },
    content: [],
    categories: [],
    cover: '',
    status: '',
    author: { id: -1, firstname: '', lastname: '', username: '', avatar: '' },
    createdAt: '',
    updatedAt: '',
    publishedAt: '',
}