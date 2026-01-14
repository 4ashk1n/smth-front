
import { ActionIcon, Burger, Stack, Transition } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { observer } from "mobx-react-lite"
import { useArticleStore } from "../../../entities/article/contexts/article.context"
import ActionButtons from "../../../features/ArticleReaderActions/ui/ActionButtons"
import EditArticleOverlayButtons from "../../../features/EditArticle/ui/tools/EditArticleOverlayButtons"


const ActionsMenu: React.FC<{}> = observer(() => {
    const article = useArticleStore()
    const [opened, { toggle }] = useDisclosure();
    return (<>
        <Stack
            w='fit-content'
            h='fit-content'
            pos={'absolute'}
            justify="center"
            right={8}
            bottom={88}
            gap={24}
        >

            <Transition
                mounted={opened}
                duration={200}
                transition={'slide-up'}
            >
                {
                    (styles) =>
                        <Stack
                            gap={24}
                            justify="center"
                            align="center"
                            style={styles}
                        >
                            {
                                article.editMode ? 
                                    <EditArticleOverlayButtons />
                                    : <ActionButtons />
                            }
                        </Stack>
                }

            </Transition>
            <ActionIcon
                size='40px'
                radius={'10px'}
                onClick={toggle}
                bg={article.mainCategory.colors.accentColor + '40'}
                style={{backdropFilter: 'blur(10px)'}}
            >
                <Burger size={'sm'} opened={opened} color={article.mainCategory.colors.lightColor} />
            </ActionIcon>

        </Stack>
    </>)
})

export default ActionsMenu