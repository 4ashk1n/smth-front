import { useContext, useEffect, useState } from "react"

import { observer } from "mobx-react"
import { Stack, Anchor, Image as MantineImage, Text, TextInput, Group, FileInput, ActionIconGroup, FileButton, ActionIcon, ButtonGroup } from "@mantine/core"

import { FaPlus, FaX } from "react-icons/fa6"
import type { Image } from "../../../../entities/article/types/content.types"
import { useArticleStore } from "../../../../entities/article/contexts/article.context"
import HighlitedBlock from "../../../../shared/ui/blocks/HighlitedBlock"

const ImageBlockEdit: React.FC<{
    block: Image
}> = observer((props) => {
    const [block, setBlock] = useState(props.block)
    const article = useArticleStore()

    const saveChanges = () => {
        if (props.block.label === block.label && props.block.source === block.source && props.block.sourceUrl === block.sourceUrl && props.block.url === block.url) return
        article.content.editBlock(block)
    }

    return (<>
        <HighlitedBlock
            onBlur={saveChanges}
            p={0}
            w='100%'
            h='100%'
            glow
            {...article.mainCategory.colors}
        >
            {
                block.url ?
                    <MantineImage src={props.block.url} w='100%' h='100%' fit='cover' />
                    : null
            }

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
                <TextInput
                    size="xs"
                    value={block.label}
                    fw={700}
                    h={'fit-content'}
                    w='100%'
                    styles={{
                        input: {
                            fontSize: '18px',
                            lineHeight: '1.4',
                            color: '#ffffffc0'
                        }
                    }}
                    variant="unstyled"
                    onMouseDown={(e) => { e.stopPropagation(); e.preventDefault }}
                    onChange={(e) => setBlock({ ...block, label: e.currentTarget.value })}
                    placeholder="Описание"
                />
                <Group gap={10} wrap="nowrap" align="center">
                    <Text
                        fz={18}
                        lh={'1.4'}
                        fw={400}
                        c='#ffffff80'
                    >
                        Источник:
                    </Text>
                    <TextInput
                        size="xs"
                        fw={400}
                        w='100%'
                        styles={{
                            input: {
                                height: 'fit-content',
                                fontSize: '18px',
                                lineHeight: '1.4',
                                color: '#ffffff80'
                            }
                        }}
                        value={block.sourceUrl}
                        variant="unstyled"
                        onMouseDown={(e) => { e.stopPropagation(); e.preventDefault }}
                        onChange={(e) => setBlock({ ...block, sourceUrl: e.currentTarget.value })}
                        placeholder="URL"
                    />
                </Group>

            </Stack>



        </HighlitedBlock>
    </>)
})

export default ImageBlockEdit