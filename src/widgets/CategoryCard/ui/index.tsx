import { Group, Skeleton, Text } from "@mantine/core";
import type { Category } from "../../../entities/category/types/category.types";

const CategoryCard: React.FC<{
    category?: Category;
    loading?: boolean;
    variant?: "full" | "list";
}> = ({ category, loading = false, variant = "full" }) => {
    if (!loading && !category) return null;

    const colors = category?.colors ?? {
        accentColor: "#8a8a8a",
        lightColor: "#d5d5d5",
        darkColor: "#1a1a1a",
    };

    const isList = variant === "list";

    return (
        <Group
            style={{
                background: `linear-gradient(90deg, ${colors.accentColor} -100%, ${colors.lightColor} 100%)`,
                borderRadius: "10px",
                zIndex: 1,
            }}
            p={isList ? 12 : 40}
            justify={isList ? "space-between" : "center"}
        >
            <Skeleton visible={loading} w={isList ? "100%" : "fit-content"}>
                <Text fz={isList ? 18 : 36} fw={700} c={colors.darkColor}>
                    {category ? `${category.emoji} ${category.name}` : "Category Name"}
                </Text>
            </Skeleton>
        </Group>
    );
};

export default CategoryCard;
