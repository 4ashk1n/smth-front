import { Group, Stack, Text } from "@mantine/core"
import type { GetArticleCardDTO } from "smth-shared/src/dto/article.dto"
import type { CategoryColors } from "../../../category/types/category.types"
import ReadButton from "./ReadButton"
import Tags from "./Tags"
import HighlitedBlock from "../../../../shared/ui/blocks/HighlitedBlock"

const ArticleCardCompact = (article: GetArticleCardDTO) => {
    return (
        <HighlitedBlock {...article.mainCategory as CategoryColors} direction={'column'} p={20} gap={20}
            className="border border-[#323232] rounded-[10px] cursor-pointer transition ease-in-out duration-100"
        >
            <Tags
                category={article.mainCategory.emoji + " " + article.mainCategory.name}
                institution="НИУ ВШЭ"
                contrast={false}
                onClickCategory={() => { }}
                onClickInstitution={() => { }}
            />


            <Stack gap={5}>
                <Text c="white" fw={600} fz={24} lh={1}>
                    {article.title}
                </Text>

                <Text c="white" fz={14} opacity={0.5} lh={1}>
                    {article.description}
                </Text>
            </Stack>

            <Group justify="end" w={'100%'}>
                <ReadButton
                    articleId={article.id}
                    accentColor={article.mainCategory.accentColor}
                    darkColor={article.mainCategory.darkColor}
                    lightColor={article.mainCategory.lightColor}
                />
            </Group>


        </HighlitedBlock>
    )
}

export default ArticleCardCompact