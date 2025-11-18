import { Grid } from "@mantine/core"
import type { GetArticleCardDTO } from "smth-shared/src/dto/article.dto"
import CategoryCard from "../../../CategoryCard/ui"
import { Parallax } from "react-scroll-parallax"
import ArticleCardCompact from "../../../../entities/article/ui/ArticleCard/ArticleCard.Compact"
import ArticleCardLarge from "../../../../entities/article/ui/ArticleCard/ArticleCard.Large"
import type { Category, CategoryColors } from "../../../../entities/category/types/category.types"
import Object3dBlock from "../../../../entities/article/ui/ArticleContent/Object3dBlock"


const Grid_4s1b1c: React.FC<{ articles: GetArticleCardDTO[], category: Category, flip?: boolean }> = ({ articles, category, flip = false }) => {
    if (articles.length < 5) return null
    return (
        <Grid
            pos='relative'
            gutter={20}
            columns={4}
            style={{ direction: flip ? 'rtl' : 'ltr', overflow: 'visible' }}
            
        >

            <Parallax
                translateY={[-50, 50]}>
                <div style={{
                    background: `radial-gradient(circle at ${flip ? '15%' : '85%'} 50%, ${category.colors.accentColor} 0%, #00000000 50vh)`,
                    backgroundRepeat: 'no-repeat',
                    overflow: 'visible',
                    position: 'absolute',
                    width: '100vw',
                    height: '100vh',
                    zIndex: -1,
                    right: flip ? 'auto' : '-100vw',
                    left: flip ? '-100vw' : 'auto',
                    filter: 'blur(100px)',
                    opacity: 0.8
                }}></div>
            </Parallax>

            <Grid.Col span={2}>
                <Object3dBlock h='100%' blocktype={'article'} {...(flip ? Object3dPropsFlipped[0] : Object3dProps[0])} {...articles[0].mainCategory as CategoryColors} >
                    <ArticleCardLarge {...articles[0]} />
                </Object3dBlock>
            </Grid.Col>

            <Grid.Col span={2}>

                <Grid columns={2} style={{ zIndex: 1 }}>
                    <Grid.Col span={2} style={{ zIndex: 1 }}>
                        {/* <Object3dBlock blocktype={'article'} {...Object3dProps[5]} {...articles[0].mainCategory} > */}
                        <CategoryCard category={category} />
                        {/* </Object3dBlock> */}
                    </Grid.Col>
                    <Grid.Col span={1} style={{ zIndex: 1 }}>
                        {/* <Object3dBlock blocktype={'article'} {...Object3dProps[1]} {...articles[1].mainCategory} > */}
                        <ArticleCardCompact {...articles[1]} />
                        {/* </Object3dBlock> */}
                    </Grid.Col>
                    <Grid.Col span={1} style={{ zIndex: 1 }}>
                        {/* <Object3dBlock blocktype={'article'} {...Object3dProps[2]} {...articles[2].mainCategory} > */}
                        <ArticleCardCompact {...articles[2]} />
                        {/* </Object3dBlock> */}
                    </Grid.Col>
                    <Grid.Col span={1} style={{ zIndex: 1 }}>
                        {/* <Object3dBlock blocktype={'article'} {...Object3dProps[3]} {...articles[3].mainCategory} > */}
                        <ArticleCardCompact {...articles[3]} />
                        {/* </Object3dBlock> */}
                    </Grid.Col>
                    <Grid.Col span={1} style={{ zIndex: 1 }}>
                        {/* <Object3dBlock blocktype={'article'} {...Object3dProps[4]} {...articles[4].mainCategory} > */}
                        <ArticleCardCompact {...articles[4]} />
                        {/* </Object3dBlock> */}
                    </Grid.Col>
                </Grid>
            </Grid.Col>
        </Grid>
    )
}

export default Grid_4s1b1c;


const Object3dProps = [
    {
        depth: 5,
        translateX: 0,
        translateY: 0,
        translateZ: 0,
        rotateX: -5,
        rotateY: -15,
        rotateZ: -5,
        scale: 1
    },
    {
        depth: 3,
        translateX: 0,
        translateY: 0,
        translateZ: 0,
        rotateX: 5,
        rotateY: -10,
        rotateZ: 0,
        scale: 1
    },
    {
        depth: 3,
        translateX: 0,
        translateY: 0,
        translateZ: 0,
        rotateX: 5,
        rotateY: -10,
        rotateZ: 0,
        scale: 1
    },
    {
        depth: 3,
        translateX: 0,
        translateY: 0,
        translateZ: 0,
        rotateX: 5,
        rotateY: -10,
        rotateZ: 0,
        scale: 1
    },
    {
        depth: 3,
        translateX: 0,
        translateY: 0,
        translateZ: 0,
        rotateX: 5,
        rotateY: -10,
        rotateZ: 0,
        scale: 1
    },
    {
        depth: 3,
        translateX: 0,
        translateY: 0,
        translateZ: 0,
        rotateX: 5,
        rotateY: -10,
        rotateZ: 0,
        scale: 1
    },
]

const Object3dPropsFlipped = [
    {
        depth: 5,
        translateX: 0,
        translateY: 0,
        translateZ: 0,
        rotateX: -5,
        rotateY: 15,
        rotateZ: 5,
        scale: 1
    },
    {
        depth: 3,
        translateX: 0,
        translateY: 0,
        translateZ: 0,
        rotateX: 5,
        rotateY: -10,
        rotateZ: 0,
        scale: 1
    },
    {
        depth: 3,
        translateX: 0,
        translateY: 0,
        translateZ: 0,
        rotateX: 5,
        rotateY: -10,
        rotateZ: 0,
        scale: 1
    },
    {
        depth: 3,
        translateX: 0,
        translateY: 0,
        translateZ: 0,
        rotateX: 5,
        rotateY: -10,
        rotateZ: 0,
        scale: 1
    },
    {
        depth: 3,
        translateX: 0,
        translateY: 0,
        translateZ: 0,
        rotateX: 5,
        rotateY: -10,
        rotateZ: 0,
        scale: 1
    },
    {
        depth: 3,
        translateX: 0,
        translateY: 0,
        translateZ: 0,
        rotateX: 5,
        rotateY: -10,
        rotateZ: 0,
        scale: 1
    },
]