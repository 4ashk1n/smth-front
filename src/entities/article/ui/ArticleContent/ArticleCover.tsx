import React, { useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { useArticleStore } from '../../contexts/article.context'
import { Group, Stack, Text } from '@mantine/core'
import ResponsiveGridLayout from '../../../../shared/ui/grids/ResponsiveGridLayout'
import { useIsMobileScreen } from '../../../../shared/lib/useIsMobile'
import Object3dBlock from './Object3dBlock'
import ImageBlock from './ImageBlock'
import IconBlock from './IconBlock'
import EditArticleTitle from '../../../../features/EditArticle/ui/cover/EditArticleTitle'
import EditArticleDescription from '../../../../features/EditArticle/ui/cover/EditArticleDescription'
import EditArticleCategories from '../../../../features/EditArticle/ui/cover/EditArticleCategories'

const ArticleCover: React.FC<{}> = observer(() => {
    const article = useArticleStore()
    const isMobile = useIsMobileScreen()

    const coverBlock = article.content.coverBlock


    return (
        <ResponsiveGridLayout
            className="layout"
            cols={{ lg: 2, md: 2, sm: 2, xs: 2, xxs: 2 }}
            rowHeight={isMobile ? 80 : 180}
            compactType={null}
            containerPadding={{ lg: [0, 0], md: [0, 0], sm: [0, 0], xs: [0, 0] }}
            maxRows={4}
            margin={{ lg: [36, 18], md: [36, 18], sm: [16, 16], xs: [16, 16], xxs: [16, 16] }}
        >
            <div
                key={'title'}
                data-grid={{ w: 2, h: 2, x: 0, y: 1, static: true }}
            >
                <Stack gap={16}>
                    {
                        article.editMode ?
                            <EditArticleTitle /> :
                            <Text
                                fz={48}
                                lh={1}
                                fw={900}
                                c={`${article.mainCategory.colors.lightColor}`}
                                style={{
                                    textShadow: '0 4px 4px rgba(0, 0, 0, 0.25)',
                                    fontVariantCaps: 'small-caps'
                                }}
                            >
                                {article.title}
                            </Text>
                    }

                    {
                        article.editMode ?
                            <EditArticleDescription />
                            :
                            <Text
                                fz={24}
                                lh={1}
                                fw={200}
                                c={`${article.mainCategory.colors.lightColor}`}
                                style={{
                                    textShadow: '0 4px 4px rgba(0, 0, 0, 0.25)'
                                }}
                            >
                                {article.description}
                            </Text>
                    }

                    <Stack gap={0}>

                        <Group
                            align='center'
                            justify='start'
                            gap={8}
                        >
                            <Text
                                fw={900}
                                fz={18}
                                c={article.mainCategory.colors.accentColor}
                                lh={'24px'}
                                style={{
                                    fontVariantCaps: 'small-caps',
                                    // textShadow: `0 0 8px ${article.mainCategory.colors.lightColor}40`
                                }}
                            >
                                #{article.mainCategory.name}

                            </Text>

                            {
                                article.editMode ?
                                    <EditArticleCategories />
                                    : null
                            }
                        </Group>
                        {
                            article.categories.slice(1).map((c, i) => (
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
            </div>

            <div
                key='abcderf'
                data-grid={{ w: 2, h: 4, x: 0, y: 4, static: true }}
                style={{ height: '100%' }}
            >
                <Object3dBlock
                    h='100%'
                    w='100%'
                    blocktype={coverBlock.type}
                    {...article.mainCategory.colors}
                    translateX={0}
                    translateY={0}
                    translateZ={3}
                    rotateX={-30}
                    rotateY={30}
                    rotateZ={30}
                    scale={1}
                    depth={5}
                >
                    {
                        coverBlock.type === 'image' ? <ImageBlock block={coverBlock} /> :
                            coverBlock.type === 'icon' ? <IconBlock block={coverBlock} /> : null
                    }
                </Object3dBlock>

            </div>
        </ResponsiveGridLayout>

    )
})

export default ArticleCover