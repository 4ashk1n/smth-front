import React from 'react'
import { observer } from 'mobx-react-lite'
import { useArticleStore } from '../../contexts/article.context'
import { Stack, Text } from '@mantine/core'
import ResponsiveGridLayout from '../../../../shared/ui/grids/ResponsiveGridLayout'
import { useIsMobileScreen } from '../../../../shared/lib/useIsMobile'
import Object3dBlock from './Object3dBlock'

const ArticleCover: React.FC<{}> = observer(() => {
    const article = useArticleStore()
    const isMobile = useIsMobileScreen()

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
                data-grid={{ w: 2, h: 2, x: 0, y: 1 }}
            >
                <Stack gap={16}>
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
            </div>

            <div 
                data-grid={{ w: 2, h: 2, x: 2, y: 1 }}
            >
                <Object3dBlock 
                    h='100%' 
                    blocktype={'image'} 
                    {...article.mainCategory.colors}
                    translateX={0}
                    translateY={0}
                    translateZ={0}
                    rotateX={0}
                    rotateY={0}
                    rotateZ={0}
                    scale={1}
                    depth={5}
                >
                    
                </Object3dBlock>

            </div>
        </ResponsiveGridLayout>

    )
})

export default ArticleCover