import { useEffect, useState } from "react"

import { Stack, Textarea } from "@mantine/core"

import { useArticleStore } from "../../../../entities/article/contexts/article.context"
import type { Image } from "../../../../entities/article/types/content.types"
import HighlitedBlock from "../../../../shared/ui/blocks/HighlitedBlock"
import ImageInput from "../../../../shared/ui/inputs/ImageInput/ui"


const ImageBlockEdit: React.FC<{
    block: Image
}> = (props) => {
    const [block, setBlock] = useState(props.block)
    const article = useArticleStore()

    // TODO: Загрузка изображения на сервер

    const handleImageLoad = (url: string) => {
        setBlock({ ...block, url })
    }

    const handleImageClear = () => {
        setBlock({ ...block, url: '' })
    }

    useEffect(() => {
        article.content.editBlock(block)
    }, [block])
    

    return (<>
        <HighlitedBlock
            p={0}
            w='100%'
            h='100%'
            glow
            {...article.mainCategory.colors}
        >
            <ImageInput
                onImageClear={handleImageClear}
                onImageLoad={handleImageLoad}
                dropzoneProps={{
                    w: '100%',
                    h: '100%',
                    c: article.mainCategory.colors.accentColor,
                    radius: '5px',
                }}
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    boxSizing: 'border-box',
                    padding: '8px',
                }}
            />


            <Stack
                pos={'absolute'}
                hidden={!block.url}
                bottom={0}
                left={0}
                gap={0}
                w='100%'
                h='fit-content'

                style={{
                    // backdropFilter: 'blur(10px)',
                    background: `linear-gradient(180deg, ${article.mainCategory.colors.darkColor + '00'} 0%, ${article.mainCategory.colors.darkColor + '80'} 20%, ${article.mainCategory.colors.darkColor} 100%)`
                }}
                p={10}
                justify="end"
            >
                <Textarea
                    size=""
                    value={block.label}
                    fw={400}
                    h={'fit-content'}
                    maxRows={3}
                    maxLength={64}
                    autosize
                    w='100%'
                    lh={1}
                    classNames={{
                        input: `placeholder-[#ffffff80]!`
                    }}
                    styles={{
                        input: {
                            fontSize: '12px',
                            lineHeight: '1',
                            color: article.mainCategory.colors.lightColor,
                            // '&::placeholder': {
                            //     color: article.mainCategory.colors.accentColor + '80'
                            // }
                        }
                    }}
                    variant="unstyled"
                    onMouseDown={(e) => { e.stopPropagation(); e.preventDefault }}
                    onChange={(e) => setBlock({ ...block, label: e.currentTarget.value })}
                    placeholder="Описание"
                />
                {/* <Group gap={5} wrap="nowrap" align="center">
                    <Text
                        fz={10}
                        lh={'1'}
                        fw={200}
                        c={article.mainCategory.colors.lightColor}
                    >
                        Источник:
                    </Text>
                    <TextInput
                        size=""
                        lh={1}
                        fw={200}
                        w='100%'
                        styles={{
                            input: {
                                height: 'fit-content',
                                fontSize: '10px',
                                lineHeight: '1',
                                color: article.mainCategory.colors.lightColor
                            }
                        }}
                        value={block.sourceUrl}
                        variant="unstyled"
                        onMouseDown={(e) => { e.stopPropagation(); e.preventDefault }}
                        onChange={(e) => setBlock({ ...block, sourceUrl: e.currentTarget.value })}
                        placeholder="URL"
                    />
                </Group> */}

            </Stack>



        </HighlitedBlock>
    </>)
}

export default ImageBlockEdit