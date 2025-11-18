import type { Category } from "../types/Category";

export const ALL_CATEGORIES: Category[] = [
    // I. Естественные и точные науки
    { id: 1, name: "Физика", emoji: "🪐", lightColor: "#CCE0FF", darkColor: "#2E0854", accentColor: "#0066FF" },
    { id: 2, name: "Химия", emoji: "🧪", lightColor: "#F2E5FF", darkColor: "#2E0854", accentColor: "#8E44AD" },
    { id: 3, name: "Биология и экология", emoji: "🌱", lightColor: "#DFFFD6", darkColor: "#2E0854", accentColor: "#44B244" },
    { id: 4, name: "Астрономия и космос", emoji: "🌌", lightColor: "#E0E7FF", darkColor: "#2E0854", accentColor: "#2980B9" },
    { id: 5, name: "Математика", emoji: "➗", lightColor: "#ECF0F1", darkColor: "#2E0854", accentColor: "#333333" },
    { id: 6, name: "Науки о Земле", emoji: "🌍", lightColor: "#F3E5AB", darkColor: "#2E0854", accentColor: "#CBA135" },
    { id: 7, name: "Медицина и здоровье", emoji: "🩺", lightColor: "#FADBD8", darkColor: "#2E0854", accentColor: "#E74C3C" },
    { id: 8, name: "Инженерия и технологии", emoji: "⚙️", lightColor: "#ECF0F1", darkColor: "#2E0854", accentColor: "#7F8C8D" },

    // II. Общественные и гуманитарные науки
    { id: 9, name: "История и археология", emoji: "🏺", lightColor: "#FDE8E8", darkColor: "#333333", accentColor: "#8B0000" },
    { id: 10, name: "Обществознание и право", emoji: "⚖️", lightColor: "#ECF0F1", darkColor: "#333333", accentColor: "#2C3E50" },
    { id: 11, name: "Филология и языки мира", emoji: "📚", lightColor: "#F5E5FF", darkColor: "#333333", accentColor: "#9B59B6" },
    { id: 12, name: "Психология", emoji: "🧠", lightColor: "#FFE4F2", darkColor: "#333333", accentColor: "#FF00CC" },
    { id: 13, name: "Философия и мышление", emoji: "💭", lightColor: "#E0F7F4", darkColor: "#333333", accentColor: "#00B5AD" },

    // III. Искусство и творчество
    { id: 14, name: "Литература", emoji: "📖", lightColor: "#F9EBEA", darkColor: "#145A32", accentColor: "#B03A2E" },
    { id: 15, name: "Кино и театр", emoji: "🎬", lightColor: "#FFF3E0", darkColor: "#145A32", accentColor: "#DAA520" },
    { id: 16, name: "Искусство и дизайн", emoji: "🎨", lightColor: "#F5E5FF", darkColor: "#145A32", accentColor: "#8E44AD" },
    { id: 17, name: "Музыка и звук", emoji: "🎵", lightColor: "#E0E7FF", darkColor: "#145A32", accentColor: "#4B0082" },
    { id: 18, name: "Фото и медиаискусство", emoji: "📸", lightColor: "#ECF0F1", darkColor: "#145A32", accentColor: "#5D6D7E" },

    // IV. Образ жизни и развитие
    { id: 19, name: "Школьная и студенческая жизнь", emoji: "🏫", lightColor: "#E5F8E8", darkColor: "#117864", accentColor: "#00FF66" },
    { id: 20, name: "Внеучебная активность", emoji: "🎯", lightColor: "#F0FFF4", darkColor: "#117864", accentColor: "#44B244" },
    { id: 21, name: "Проекты и конкурсы", emoji: "🏆", lightColor: "#FFF5E1", darkColor: "#117864", accentColor: "#DAA520" },
    { id: 22, name: "Профориентация и карьера", emoji: "💼", lightColor: "#F5F5F5", darkColor: "#117864", accentColor: "#333333" },
    { id: 23, name: "Волонтёрство и стажировки", emoji: "🤝", lightColor: "#EDEDF7", darkColor: "#117864", accentColor: "#7C58D5" },

    // V. Цифровой мир
    { id: 24, name: "Информатика и ИИ", emoji: "💻", lightColor: "#D4EDF7", darkColor: "#2E4053", accentColor: "#2980B9" },
    { id: 25, name: "Кибербезопасность", emoji: "🛡️", lightColor: "#FFDADA", darkColor: "#2E4053", accentColor: "#C0392B" },
    { id: 26, name: "Игры", emoji: "🎮", lightColor: "#E5F8E8", darkColor: "#2E4053", accentColor: "#00C7B7" },
    { id: 27, name: "Технологии будущего", emoji: "🚀", lightColor: "#EDEDF7", darkColor: "#2E4053", accentColor: "#800080" },

    // VI. Репортажи и мнения
    { id: 28, name: "Интервью", emoji: "💡", lightColor: "#E0F7F4", darkColor: "#2C3E50", accentColor: "#00B5AD" },
    { id: 29, name: "Репортажи", emoji: "📰", lightColor: "#F3E5AB", darkColor: "#2C3E50", accentColor: "#5D4037" },
    { id: 30, name: "Истории выпускников", emoji: "📜", lightColor: "#ECF0F1", darkColor: "#2C3E50", accentColor: "#34495E" },
]