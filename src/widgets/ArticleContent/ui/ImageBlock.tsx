import { Anchor, Image as MantineImage, Stack, Text } from "@mantine/core";
import type { Image } from "../../../entities/article/types/blocks/Image";
import type { Category } from "../../../entities/category/types/Category";
import HighlitedBlock from "../../../shared/blocks/HighlitedBlock";
import Object3dBlock from "../../../shared/blocks/Object3dBlock";
import ReactIcon from "../../../shared/icon/ReactIcon";
import type { CategoryColors } from "../../../entities/category/types/CategoryColors";

const ImageBlock: React.FC<{ block: Image, mainCategory: CategoryColors }> = (props) => {

    const Image2d = () =>
        <HighlitedBlock
            p={0}
            w='100%'
            // glow={props.block.object3d === undefined}
            glow
            {...props.mainCategory}
        >
            <MantineImage src={props.block.url} w='100%' h='100%' fit='contain' />

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
                            fz={18}
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
                            fz={18}
                            lh={'1.4'}
                            fw={400}
                            c='#ffffff80'
                        >
                            Источник: <Anchor c='#ffffff80' underline="hover" target="_blank" href={props.block.sourceUrl}>{props.block.source}</Anchor>
                        </Text>
                        : null
                }
            </Stack>



        </HighlitedBlock>

    return (<>
        {props.block.object3d ?
            <Object3dBlock blocktype={'image'} {...props.block.object3d} {...props.mainCategory}>
                <Image2d />
            </Object3dBlock>
            : <Image2d />}
    </>)
}

export default ImageBlock