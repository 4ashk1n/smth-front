import { Anchor, Image as MantineImage, Stack, Text } from "@mantine/core";
import type { Image } from "../../types/content.types";
import { useArticleStore } from "../../contexts/article.context";
import HighlitedBlock from "../../../../shared/ui/blocks/HighlitedBlock";
import Object3dBlock from "./Object3dBlock";


const ImageBlock: React.FC<{ block: Image }> = (props) => {
    const { mainCategory } = useArticleStore()

    const Image2d = () =>
        <HighlitedBlock
            p={0}
            w='100%'
            h='100%'
            glow
            {...mainCategory.colors}
        >
            <MantineImage src={props.block.url} w='100%' h='100%' fit='cover' />

            <Stack
                pos={'absolute'}
                bottom={0}
                left={0}
                gap={0}
                w='100%'
                style={{
                    background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%)'
                }}
                p={20}
            >
                {
                    props.block.label ?
                        <Text
                            fz={14}
                            lh={'1.4'}
                            fw={700}
                            c='#ffffffc0'
                        >
                            {props.block.label}
                        </Text>
                        : null
                }
                {
                    props.block.source ?
                        <Text
                            fz={12}
                            lh={'1.4'}
                            fw={400}
                            c='#ffffff80'
                        >
                            Источник: <Anchor c='#ffffff80' size="12px" underline="hover" target="_blank" href={props.block.sourceUrl}>{props.block.source}</Anchor>
                        </Text>
                        : null
                }
            </Stack>



        </HighlitedBlock>

    return (<>
        {props.block.object3d ?
            <Object3dBlock blocktype={'image'} {...props.block.object3d} {...mainCategory.colors}>
                <Image2d />
            </Object3dBlock>
            : <Image2d />}
    </>)
}

export default ImageBlock