import { Group, Stack, Text } from "@mantine/core"
import Tags from "../../../entities/article/ui/card/Tags"
import type { GetArticleCardDTO } from "smth-shared/src/dto/article.dto"
import ReadButton from "../../../entities/article/ui/card/ReadButton"

const ArticleCardCompact = (article: GetArticleCardDTO) => {
    return (
        <Stack p={20} gap={20}
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
                    accentColor={article.mainCategory.accentColor}
                    darkColor={article.mainCategory.darkColor}
                    lightColor={article.mainCategory.lightColor}
                />
            </Group>


        </Stack>
    )
}

export default ArticleCardCompact