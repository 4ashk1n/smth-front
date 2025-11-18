import { Stack, Text, Title } from "@mantine/core";
import type { CategoryColors } from "../../../category/types/category.types";
import { useArticleStore } from "../../contexts/article.context";
import UserPill from "../../../user/ui/UserPill";
import { observer } from "mobx-react-lite";
import HighlitedBlock from "../../../../shared/ui/blocks/HighlitedBlock";
import { useIsMobileScreen } from "../../../../shared/lib/useIsMobile";


const ArticleHeader: React.FC<{}> = observer(() => {
    const article = useArticleStore()
    const isMobile = useIsMobileScreen()

    return (<>
        {
            isMobile ?
                <Stack gap={10} w='100%' px={16}>
                    <Title
                        order={1}
                        c={article.mainCategory.colors.lightColor + 'dd'}
                        fz={16}
                        lh={1}
                        fw={600}
                        style={{
                            fontVariantCaps: 'small-caps',
                            textShadow: `0 0px 16px ${article.mainCategory.colors.lightColor}40`
                        }}
                    >
                        {article.title}
                    </Title>

                    <Text fw={100} fz={14} c={article.mainCategory.colors.lightColor + '80'} lh={1}>
                        {article.description}
                    </Text>
                </Stack>

                :

                <HighlitedBlock
                    p={40}
                    w='100%'
                    h='100%'
                    {...article.mainCategory.colors as CategoryColors}
                    direction={'column'}
                    justify={'space-between'}
                    style={{
                        zIndex: 10
                    }}
                >

                    <Stack gap={18}>
                        <Title
                            order={1}
                            c={article.mainCategory.colors.lightColor}
                            fz={36}
                            lh={1}
                            fw={900}
                            style={{
                                fontVariantCaps: 'small-caps',
                                textShadow: `0 0px 16px ${article.mainCategory.colors.lightColor}40`
                            }}
                        >
                            {article.title}
                        </Title>

                        <Text fw={100} fz={18} c={article.mainCategory.colors.lightColor + '80'} lh={1}>
                            {article.description}
                        </Text>


                        <Stack gap={0}>
                            <Text
                                fw={900}
                                fz={18}
                                c={article.mainCategory.colors.accentColor}
                                lh={'24px'}
                                style={{
                                    fontVariantCaps: 'small-caps',
                                    textShadow: `0 0 8px ${article.mainCategory.colors.lightColor}40`
                                }}
                            >
                                #{article.mainCategory.name}
                            </Text>
                            {
                                article.categories.map((c, i) => (
                                    <Text
                                        key={i}
                                        fz={14}
                                        fw={900}
                                        c={article.mainCategory.colors.accentColor + '80'}
                                        lh={'18px'}
                                        style={{
                                            fontVariantCaps: 'small-caps',
                                            textShadow: `0 0 2px ${article.mainCategory.colors.lightColor}40`
                                        }}
                                    >
                                        #{c.name}
                                    </Text>
                                ))
                            }
                        </Stack>

                    </Stack>
                    <UserPill size="md" user={article.author} />
                </HighlitedBlock>
        }
    </>)
})

export default ArticleHeader;