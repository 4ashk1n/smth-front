export const ARTICLE = {
    id: 1,
    title: 'test title',
    description: 'test description',
    mainCategory: { 
        id: 1, 
        emoji: '👨‍🏫', 
        name: 'test category', 
        accentColor: '#00B5AD', 
        darkColor: '#00796B', 
        lightColor: '#E0F7F4' , 
        // accentColor: '#b500a6', 
        // darkColor: '#79006f', 
        // lightColor: '#f7e0f4' 
    },
    categories: [{ id: 1, emoji: '👨‍🏫', name: 'test category' },],
    cover: 'https://plus.unsplash.com/premium_photo-1681426414801-f36575c2de9e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y292ZXJ8ZW58MHx8MHx8fDA%3D',
    status: 'published',
    author: { id: 1, firstname: 'test', lastname: 'test', username: 'test', avatar: '/images/logo.svg' },
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    publishedAt: '2023-01-01T00:00:00.000Z',
    content: {
        rows: [
            [
                {
                    type: 'paragraph',
                    title: 'Кто такой Дуров и почему он до сих пор на хайпе?',
                    content: 'Павел Дуров — это не просто основатель ВКонтакте и Telegram. Это человек, который выбрал путь одиночки, отказался от миллиардов и убежал от всего, что его ограничивало. У него нет дома, нет гражданства, нет офиса. Зато есть миллионы пользователей и чёткая позиция — свобода личных данных превыше всего. Мы встретились с Павлом онлайн. Он отвечал голосом, но без камеры. Фоном был глухой ветер и иногда слышался шум моря.',
                    span: 5,
                    object3d: {
                        depth: 5,
                        translateX: 0,
                        translateY: 0,
                        translateZ: 0,
                        rotateX: 10,
                        rotateY: -10,
                        rotateZ: 0,
                        scale: 1
                    }
                },
                {
                    type: 'image',
                    url: 'https://s0.rbk.ru/v6_top_pics/media/img/5/27/347495348582275.jpeg',
                    span: 7,
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
                    }
                }
            ],
            [
                {
                    type: 'icon',
                    name: 'FaTelegram',
                    span: 5,
                    object3d: {
                        depth: 5,
                        translateX: 0,
                        translateY: 0,
                        translateZ: 5,
                        rotateX: 10,
                        rotateY: -10,
                        rotateZ: -30,
                        scale: 1
                    }
                },
                {
                    type: 'col',
                    children: [
                        {
                            type: 'paragraph',
                            title: 'О технологиях и будущем',
                            content: '*Павел, что будет с соцсетями через 10 лет?*\n\n«Будущее — за теми, кто не навязывает. Все устали от умных лент, рекламы, манипуляций. Люди хотят просто говорить друг с другом. Мессенджеры — это новая социальная сеть. Без лайков, но с реальными разговорами.»',
                        },
                        {
                            type: 'paragraph',
                            title: 'О безопасности',
                            content: '*Ты часто говоришь о свободе слова. Но где граница между свободой и опасностью?*\n\n«Свобода — это не анархия. Я против террора, агрессии, насилия. Но я также против того, чтобы государства решали, что “можно говорить”, а что — нет. Telegram — не для зла. Но мы не станем стукачами.»',
                        },
                    ],
                    span: 7
                }
            ]
        ]
    },

};