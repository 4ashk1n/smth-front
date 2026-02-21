import type { ArticleDTO } from "../types/article.types";

export const ARTICLE_DTO_SAMPLE: ArticleDTO = {
    id: '1',
    title: 'Наш слон',
    description: 'Мы взяли интервью у Павла Дурова',
    mainCategory: {
        id: '1',
        emoji: '🐘',
        name: 'Slon',
        colors: {
            lightColor: '#F9EBEA',
            darkColor: '#145A32',
            accentColor: '#B03A2E'
        }
    },
    categories: [{
        id: '1',
        emoji: '🐘',
        name: 'Slon',
        colors: {
            lightColor: '#F9EBEA',
            darkColor: '#145A32',
            accentColor: '#B03A2E'
        }
    }],
    status: 'published',
    author: {
        id: '1',
        firstname: 'skebob',
        lastname: 'abob',
        username: 'zverinus',
        avatar: 'https://fbi.cults3d.com/uploaders/34973218/illustration-file/46f9a2d8-fb9a-482f-9b9f-8ba3c0701b6d/skiebob.jpg'
    },
    content: {
        topics: [
            {
                id: '1',
                title: 'Кто такой Дуров и почему он до сих пор на хайпе?',
                pages: [
                    {
                        id: '1',
                        blocks: [
                            {
                                id: '1',
                                type: 'paragraph',
                                content: {
                                    time: 0,
                                    blocks: [
                                        {
                                            id: 'p1',
                                        type: 'paragraph',
                                            data: {
                                                text: 'Pavel Durov is more than the founder of VKontakte and Telegram. He chose a solitary path, turned down billions, and walked away from anything that tried to limit him. He has no home, no citizenship, no office. But he does have millions of users and a clear stance: personal data freedom comes first.'
                                            }
                                        },
                                        {
                                            id: 'p2',
                                        type: 'paragraph',
                                            data: {
                                                text: 'We met Pavel online. He answered by voice, without a camera. In the background there was a low wind, and at times you could hear the sea.'
                                            }
                                        }
                                    ],
                                    version: '2.28.2'
                                },

                                layout: {
                                    i: '0',
                                    x: 0,
                                    y: 1,
                                    w: 1,
                                    h: 4
                                }
                            },
                            {
                                id: '2',
                                type: 'image',
                                url: 'https://s0.rbk.ru/v6_top_pics/media/img/5/27/347495348582275.jpeg',
                                source: 'РБК',
                                label: 'Павел Дуров сидит',
                                object3d: {
                                    depth: 5,
                                    translateX: 0,
                                    translateY: 0,
                                    translateZ: 3,
                                    rotateX: 5,
                                    rotateY: 10,
                                    rotateZ: 0,
                                    scale: 1
                                },
                                layout: {
                                    i: '1',
                                    x: 1,
                                    y: 1,
                                    w: 1,
                                    h: 2
                                },
                            },
                            {
                                id: '3',
                                type: 'icon',
                                name: 'FaTelegram',
                                layout: {
                                    i: '2',
                                    x: 0,
                                    y: 6,
                                    w: 2,
                                    h: 2
                                },
                                // object3d: {
                                //     depth: 5,
                                //     translateX: 0,
                                //     translateY: 0,
                                //     translateZ: 3,
                                //     rotateX: -15,
                                //     rotateY: 20,
                                //     rotateZ: 0,
                                //     scale: 1
                                // },
                            }
                        ],
                        topicId: '1',
                        order: 1
                    },
                    {
                        id: '2',
                        blocks: [
                            {
                                id: '3',
                                type: 'icon',
                                name: 'FaTelegram',
                                layout: {
                                    i: '2',
                                    x: 0,
                                    y: 2,
                                    w: 2,
                                    h: 4
                                }
                            }
                        ],
                        topicId: '1',
                        order: 2
                    }
                ],
                order: 1
            },
            {
                id: '2',
                title: 'Свобода мысли',
                pages: [

                    {
                        id: '22',
                        blocks: [
                            {
                                id: '4',
                                type: 'icon',
                                name: 'FaX',
                                layout: {
                                    i: '0',
                                    x: 0,
                                    y: 2,
                                    w: 2,
                                    h: 4
                                },
                                object3d: {
                                    depth: 5,
                                    translateX: 0,
                                    translateY: 0,
                                    translateZ: 3,
                                    rotateX: 5,
                                    rotateY: 10,
                                    rotateZ: 0,
                                    scale: 1
                                }
                            }
                        ],
                        topicId: '2',
                        order: 3
                    }
                ],
                order: 2
            },
            {
                id: '3',
                title: 'Свобода мысли',
                pages: [

                    {
                        id: '3',
                        blocks: [
                            {
                                id: '5',
                                type: 'icon',
                                name: 'FaX',
                                layout: {
                                    i: '0',
                                    x: 0,
                                    y: 2,
                                    w: 2,
                                    h: 4
                                },
                                object3d: {
                                    depth: 5,
                                    translateX: 0,
                                    translateY: 0,
                                    translateZ: 3,
                                    rotateX: 5,
                                    rotateY: 10,
                                    rotateZ: 0,
                                    scale: 1
                                }
                            }
                        ],
                        topicId: '3',
                        order: 4
                    }
                ],
                order: 3
            },
            {
                id: '5',
                title: 'Свобода мысли',
                pages: [

                    {
                        id: '5',
                        blocks: [
                            {
                                id: '7',
                                type: 'icon',
                                name: 'FaX',
                                layout: {
                                    i: '0',
                                    x: 0,
                                    y: 2,
                                    w: 2,
                                    h: 4
                                },
                                object3d: {
                                    depth: 5,
                                    translateX: 0,
                                    translateY: 0,
                                    translateZ: 3,
                                    rotateX: 5,
                                    rotateY: 10,
                                    rotateZ: 0,
                                    scale: 1
                                }
                            }
                        ],
                        topicId: '5',
                        order: 5
                    }
                ],
                order: 4
            },
            {
                id: '6',
                title: 'Свобода мысли',
                pages: [

                    {
                        id: '6',
                        blocks: [
                            {
                                id: '8',
                                type: 'icon',
                                name: 'FaX',
                                layout: {
                                    i: '0',
                                    x: 0,
                                    y: 2,
                                    w: 2,
                                    h: 4
                                },
                                object3d: {
                                    depth: 5,
                                    translateX: 0,
                                    translateY: 0,
                                    translateZ: 3,
                                    rotateX: 5,
                                    rotateY: 10,
                                    rotateZ: 0,
                                    scale: 1
                                }
                            }
                        ],
                        topicId: '6',
                        order: 6
                    }
                ],
                order: 5
            },
            {
                id: '7',
                title: 'Свобода мысли',
                pages: [

                    {
                        id: '7',
                        blocks: [
                            {
                                id: '9',
                                type: 'icon',
                                name: 'FaX',
                                layout: {
                                    i: '0',
                                    x: 0,
                                    y: 2,
                                    w: 2,
                                    h: 4
                                },
                                object3d: {
                                    depth: 5,
                                    translateX: 0,
                                    translateY: 0,
                                    translateZ: 3,
                                    rotateX: 5,
                                    rotateY: 10,
                                    rotateZ: 0,
                                    scale: 1
                                }
                            }
                        ],
                        topicId: '7',
                        order: 7
                    }
                ],
                order: 6
            }
        ]
    }
}