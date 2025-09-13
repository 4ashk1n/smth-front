import { Stack, Title, Text, TextInput } from "@mantine/core";
import { useContext } from "react";
import type { CategoryColors } from "../../../../entities/category/types/CategoryColors";
import UserPill from "../../../../entities/user/ui/UserPill";
import HighlitedBlock from "../../../../shared/blocks/HighlitedBlock";
import type ArticleHeader from "../../../../widgets/ArticleHeader/ui";
import { ArticleContext } from "../../../stores/ArticleStore";
import EditArticleCategories from "./EditArticleCategories";
import { observer } from "mobx-react-lite";


const EditArticleHeader: React.FC<{}> = observer(() => {
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
                <TextInput
                    variant="unstyled"
                    defaultValue={article.title}
                    fw={700}
                    placeholder="Заголовок"
                    styles={{
                        root: {
                            overflow: 'visible'
                        },
                        input: {
                            fontSize: '36px',
                            height: 'fit-content',
                            lineHeight: 1,
                            color: article.mainCategory.lightColor,
                            overflow: 'visible'
                        }
                    }}
                />

                <TextInput
                    variant="unstyled"
                    defaultValue={article.description}
                    placeholder="Описание"
                    styles={{
                        root: {
                            overflow: 'visible'
                        },
                        input: {
                            fontSize: '18px',
                            height: 'fit-content',
                            color: article.mainCategory.lightColor + '80',
                            overflow: 'visible'
                        }
                   
                    }}
                />

                <EditArticleCategories />
            </Stack>
            <UserPill size="md" user={article.author} />
        </HighlitedBlock>
    </>)
})

export default EditArticleHeader;