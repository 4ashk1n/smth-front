import { useDisclosure } from "@mantine/hooks"
import { ActionIcon, Button, Drawer, Grid } from "@mantine/core";
import { PiPencil } from "react-icons/pi";
import { useArticleStore } from "../../../../entities/article/contexts/article.context";
import { ALL_CATEGORIES } from "../../../../entities/category/samples/category.samples";
import { useEffect, useState } from "react";
import type { Category } from "../../../../entities/category/types/category.types";



const EditArticleCategories: React.FC<{}> = () => {

    const [opened, { open, close }] = useDisclosure(false);
    const article = useArticleStore();
    const [selectedCategories, setSelectedCategories] = useState(article.categories);

    const handleCategorySelect = (category: Category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter((c) => c !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    useEffect(() => {
        article.setCategories(selectedCategories);
    }, [selectedCategories.length]);

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
                    ALL_CATEGORIES.map((category: Category, i) => (
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
                                bg={selectedCategories.includes(category) ? category.colors.accentColor : '#00000080'}
                                c={selectedCategories.includes(category) ? 'white' : '#bbbbbbff'}
                                fz={12}

                                style={{
                                    boxShadow: selectedCategories.includes(category) ? `0 0 5px ${category.colors.accentColor}` : 'none'
                                }}

                                onClick={() => handleCategorySelect(category)}
                            >
                                {category.name}
                            </Button>
                        </Grid.Col>
                    ))
                }
            </Grid>
        </Drawer>
    </>)
}

export default EditArticleCategories