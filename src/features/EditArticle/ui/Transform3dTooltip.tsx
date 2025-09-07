import { Stack, Group, Slider, AngleSlider, Text } from "@mantine/core"
import { useState, useEffect, useContext } from "react"
import type { Object3d } from "../../../entities/article/types/blocks/Object3d"
import type { BlockTypes } from "../../../entities/article/types/Content"
import { ArticleContext } from "../../stores/ArticleStore"
import { useMove } from "../../../shared/hooks/useMove"

const Transform3dTooltip: React.FC<{
    block: BlockTypes,
    showTooltip: boolean
}> = ({ block, showTooltip }) => {

    const { editBlock, categoryColors } = useContext(ArticleContext)
    const [object3d, setObject3d] = useState<Object3d>(block.object3d as Object3d)

    const [pos, setPos] = useState({ x: 0, y: 0 })
    const { ref, disable: moveDisable, enable: moveEnable } = useMove(pos, setPos)

    const MARKS = [
        { value: 0 }, { value: 6 }, { value: 12 }, { value: 18 }, { value: 24 }, { value: 30 },
        { value: 36 }, { value: 42 }, { value: 48 }, { value: 54 }, { value: 60 },
        { value: 66 }, { value: 72 }, { value: 78 }, { value: 84 }, { value: 90 },
        { value: 96 }, { value: 102 }, { value: 108 }, { value: 114 }, { value: 120 },
        { value: 126 }, { value: 132 }, { value: 138 }, { value: 144 }, { value: 150 },
        { value: 156 }, { value: 162 }, { value: 168 }, { value: 174 }, { value: 180 },
        { value: 186 }, { value: 192 }, { value: 198 }, { value: 204 }, { value: 210 },
        { value: 216 }, { value: 222 }, { value: 228 }, { value: 234 }, { value: 240 },
        { value: 246 }, { value: 252 }, { value: 258 }, { value: 264 }, { value: 270 },
        { value: 276 }, { value: 282 }, { value: 288 }, { value: 294 }, { value: 300 },
        { value: 306 }, { value: 312 }, { value: 318 }, { value: 324 }, { value: 330 },
        { value: 336 }, { value: 342 }, { value: 348 }, { value: 354 }, { value: 360 },
    ]

    const onRotateXChange = (value: number) => setObject3d({ ...object3d, rotateX: value / 6 - 30 })
    const onRotateYChange = (value: number) => setObject3d({ ...object3d, rotateY: value / 6 - 30 })
    const onRotateZChange = (value: number) => setObject3d({ ...object3d, rotateZ: value / 6 - 30 })

    const onDepthChange = (value: number) => setObject3d({ ...object3d, depth: value })
    const onTranslateZChange = (value: number) => setObject3d({ ...object3d, translateZ: value })

    useEffect(() => {
        editBlock({ ...block, object3d: object3d })
    }, [object3d.rotateX, object3d.rotateY, object3d.rotateZ, object3d.depth, object3d.translateZ])

    return (<>
        <div
            ref={ref}
            style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
        >
            <Stack
                align="center"
                justify="center"
                gap={10}
                style={{
                    opacity: showTooltip ? 1 : 0,
                    position: 'absolute',
                    top: `${pos.y}px`,
                    left: `${pos.x}px`,
                    background: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1001111,
                    padding: '10px 20px',
                    borderRadius: '10px',
                    transition: 'opacity 200ms',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.5)',
                }}
                onMouseDown={(e) => { e.stopPropagation(); e.preventDefault() }}
            >
                <Stack w={'100%'} gap={10}>
                    <Group gap={10} wrap="nowrap">
                        <Text size={'12px'} c='white'>Ширина</Text>
                        <Slider
                            w={'100%'}
                            marks={[{ value: 0 }, { value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }]}
                            value={object3d.depth}
                            restrictToMarks={false}
                            min={0}
                            max={5}
                            color={categoryColors.accentColor}
                            onChange={onDepthChange}
                            onChangeEnd={moveEnable}
                            onFocus={moveDisable}
                            onMouseDown={(e) => { moveDisable(); e.stopPropagation(); e.preventDefault() }}
                        />
                    </Group>

                    <Group gap={10} wrap="nowrap">
                        <Text size={'12px'} c='white'>Глубина</Text>
                        <Slider
                            w={'100%'}
                            marks={[{ value: 0 }, { value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }]}
                            value={object3d.translateZ}
                            min={0}
                            max={5}
                            color={categoryColors.accentColor}
                            onChange={onTranslateZChange}
                            onChangeEnd={moveEnable}
                            onFocus={moveDisable}
                            // onMouseMove={moveDisable}
                            onMouseDown={(e) => { moveDisable(); e.stopPropagation(); e.preventDefault() }}
                        />
                    </Group>

                </Stack>


                <Group gap={10} wrap="nowrap">
                    <AngleSlider
                        size={50}
                        value={((object3d.rotateX || 0) + 30) * 6}
                        marks={MARKS}
                        restrictToMarks
                        onChange={(e) => {moveDisable(); onRotateXChange(e)}}
                        onChangeEnd={moveEnable}
                        onFocus={moveDisable}
                        // onMouseLeave={moveEnable}
                        onMouseDown={(e) => { moveDisable(); e.stopPropagation(); e.preventDefault() }}
                        formatLabel={() => `X`}
                    />
                    <AngleSlider
                        size={50}
                        value={((object3d.rotateY || 0) + 30) * 6}
                        marks={MARKS}
                        restrictToMarks
                        onChange={(e) => {moveDisable(); onRotateYChange(e)}}
                        onChangeEnd={moveEnable}
                        // onMouseLeave={moveEnable}
                        onMouseDown={(e) => { moveDisable(); e.stopPropagation(); e.preventDefault() }}
                        formatLabel={() => `Y`}
                    />
                    <AngleSlider
                        size={50}
                        value={((object3d.rotateZ || 0) + 30) * 6}
                        marks={MARKS}
                        restrictToMarks
                        onChange={(e) => {moveDisable(); onRotateZChange(e)}}
                        onChangeEnd={moveEnable}
                        
                        // onMouseLeave={moveEnable}
                        onMouseDown={(e) => { moveDisable(); e.stopPropagation(); e.preventDefault() }}
                        formatLabel={() => `Z`}
                    />
                </Group>

            </Stack>
        </div>
    </>)
}

export default Transform3dTooltip;