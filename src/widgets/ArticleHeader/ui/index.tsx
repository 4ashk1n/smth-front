import { Group, Stack, Text, Title } from "@mantine/core";
import type { ArticleFull } from "../../../entities/article/types/ArticleFull";
import HighlitedBlock from "../../../shared/blocks/HighlitedBlock";
import UserPill from "../../../entities/user/ui/UserPill";
import type { CategoryColors } from "../../../entities/category/types/CategoryColors";

const ArticleHeader: React.FC<{ article: ArticleFull }> = ({ article }) => {
    return (<>
        <HighlitedBlock
            p={40}
            w='100%'
            {...article.mainCategory as CategoryColors}
            direction={'row'}
            justify={'space-between'}
        >

            <Stack gap={10}>
                <Title
                    order={1}
                    c={article.mainCategory.lightColor}
                    fz={48}
                    lh={1}
                >
                    {article.title}
                </Title>

                <Text fz={24} c={article.mainCategory.lightColor + '80'} lh={1}>
                    {article.description}
                </Text>
            </Stack>
            <UserPill size="md" user={article.author} />
        </HighlitedBlock>
    </>)
}

export default ArticleHeader;