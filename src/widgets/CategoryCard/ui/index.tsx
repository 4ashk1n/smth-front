import { Group, Text } from "@mantine/core";
import type { Category } from "../../../entities/category/types/Category";

const CategoryCard: React.FC<{category: Category}> = ({category}) => {
    return (
        <Group
            style={{
                background: `linear-gradient(90deg, ${category.accentColor} -100%, ${category.lightColor} 100%)`,
                borderRadius: '10px',
                zIndex: '1'
            }}
            p={40}
            justify="center"
        > 
            <Text fz={36} fw={700} c={category.darkColor}>
                {category.emoji} {category.name}
            </Text>
        </Group>
    )
}

export default CategoryCard;