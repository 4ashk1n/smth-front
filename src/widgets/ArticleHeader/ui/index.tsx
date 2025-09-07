import { Group, Stack, Text, TextInput, Title } from "@mantine/core";
import type { ArticleFull } from "../../../entities/article/types/ArticleFull";
import HighlitedBlock from "../../../shared/blocks/HighlitedBlock";
import UserPill from "../../../entities/user/ui/UserPill";
import type { CategoryColors } from "../../../entities/category/types/CategoryColors";
import { useContext } from "react";
import { ArticleContext } from "../../../features/stores/ArticleStore";

const ArticleHeader: React.FC<{ editMode?: boolean }> = ({ editMode = false }) => {
    const { article } = useContext(ArticleContext)
    return (<>
        <HighlitedBlock
            p={40}
            w='100%'
            {...article.mainCategory as CategoryColors}
            direction={'row'}
            justify={'space-between'}
            style={{
                zIndex: 10
            }}
        >

            <Stack gap={10}>
                <Title
                    order={1}
                    c={article.mainCategory.lightColor}
                    fz={48}
                    lh={1}
                >
                    {
                        editMode ?
                            <TextInput
                                styles={{
                                    input: {
                                        background: '#00000080',
                                        border: '#000000ff 1px solid',
                                        color: 'white',
                                        borderRadius: '10px'
                                    }
                                }}
                                defaultValue={article.title}
                                size="xl"
                                placeholder="Заголовок"
                            />
                            :
                            article.title
                    }
                </Title>

                <Text fz={24} c={article.mainCategory.lightColor + '80'} lh={1}>
                    {
                        editMode ?
                            <TextInput
                                styles={{
                                    input: {
                                        background: '#00000080',
                                        border: '#000000ff 1px solid',
                                        color: 'white',
                                        borderRadius: '10px'
                                    }
                                }}
                                defaultValue={article.description}
                                size="md"
                                placeholder="Описание"
                            />
                            :
                            article.description
                    }
                </Text>
            </Stack>
            <UserPill size="md" user={article.author} />
        </HighlitedBlock>
    </>)
}

export default ArticleHeader;