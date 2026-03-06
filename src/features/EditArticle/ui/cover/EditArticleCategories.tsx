import { useDisclosure } from "@mantine/hooks"
import { ActionIcon, Button, Drawer, Grid } from "@mantine/core";
import { observer } from "mobx-react";
import { PiPencil } from "react-icons/pi";
import { useArticleStore } from "../../../../entities/article/contexts/article.context";
import type { Category } from "../../../../entities/category/types/category.types";
import { useCategoriesStore } from "../../../../entities/category/contexts/categories.context";



const EditArticleCategories: React.FC<{}> = observer(() => {

    const [opened, { open, close }] = useDisclosure(false);
    const categoriesStore = useCategoriesStore()
    const article = useArticleStore();

    const handleCategorySelect = (categoryId: string) => {
        if (article.categoryIds.includes(categoryId)) {
            article.setCategoryIds(article.categoryIds.filter((id) => id !== categoryId))
        } else {
            article.setCategoryIds([...article.categoryIds, categoryId])
        }
    };

    return (<>
        <ActionIcon size='md' c={article.mainCategory.colors.accentColor} radius={8} w='fit-content' variant="subtle" onClick={open}>
            <PiPencil />
        </ActionIcon>

        <Drawer
            opened={opened}
            onClose={close}
            // title="Категории"
            withCloseButton={false}
            size="sm"
            position="bottom"
            h='fit-content'
            zIndex={1000}
            styles={{
                content: {
                    backgroundColor: '#00000080',
                    backdropFilter: 'blur(10px)'
                },
                // header: {
                //     background: `linear-gradient(-90deg, ${article.mainCategory.colors.darkColor}, ${article.mainCategory.colors.accentColor})`,
                //     padding: '4px 8px',
                //     height: 'fit-content'
                // },
                title: {
                    color: article.mainCategory.colors.lightColor,
                    fontWeight: 600
                },
                close: {
                    color: article.mainCategory.colors.accentColor,
                    backgroundColor: '#00000000'
                },
                overlay: {
                    backgroundColor: '#00000040',
                    // backdropFilter: 'blur(10px)'
                }
            }}
        >
            <Grid
                w='100%'
                columns={2}
            >
                {
                    categoriesStore.categories.map((category: Category, i) => (
                        <Grid.Col
                            key={i}
                            span={1}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            w='100%'
                        >
                            <Button
                                w='100%'
                                radius={8}
                                variant="filled"
                                bg={article.categoryIds.includes(category.id) ? category.colors.accentColor : '#00000080'}
                                c={article.categoryIds.includes(category.id) ? 'white' : '#bbbbbbff'}
                                fz={12}

                                style={{
                                    boxShadow: article.categoryIds.includes(category.id) ? `0 0 5px ${category.colors.accentColor}` : 'none'
                                }}

                                onClick={() => handleCategorySelect(category.id)}
                            >
                                {category.name}
                            </Button>
                        </Grid.Col>
                    ))
                }
            </Grid>
        </Drawer>
    </>)
})

export default EditArticleCategories
