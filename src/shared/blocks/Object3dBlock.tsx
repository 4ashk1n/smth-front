import { Stack, type FlexProps } from "@mantine/core"
import type { Object3d } from "../../entities/article/types/blocks/Object3d"
import Tilt from 'react-parallax-tilt';
import { useEffect, useState } from "react";
import HighlitedBlock from "./HighlitedBlock";
import type { CategoryColors } from "../../entities/category/types/CategoryColors";
import { useDeviceType } from "../lib/useDeviceType";
import { Parallax } from "react-scroll-parallax";

type Object3dBlockProps = FlexProps & Object3d & CategoryColors & {
    blocktype: string
}

const Object3dBlock: React.FC<Object3dBlockProps> = (props) => {
    const [tiltAngleX, setTiltAngleX] = useState(props.rotateX)
    const [tiltAngleY, setTiltAngleY] = useState(props.rotateY)
    const [parallaxDepth, setParallaxDepth] = useState(props.translateZ)
    const deviceType = useDeviceType();

    useEffect(() => {
        setParallaxDepth(props.translateZ)
    }, [props.rotateX, props.rotateY, props.translateZ])

    return (
        <div style={{
            width: '100%',
            height: '100%',
            zIndex: -1 * props.translateZ + 5,
            position: 'relative',
        }}>
            <Parallax
                className="parallaxxxxxx"
                translateY={[-props.translateZ * 10, props.translateZ * 10]}
                style={{
                    filter: `blur(${parallaxDepth * 0.5}px)`,
                    transition: 'filter 200ms ease-in-out',
                    height: '100%',
                }}
                onChange={(e) => {
                    setTiltAngleX(- e.progress * props.rotateX * 2);
                    setTiltAngleY(- e.progress * props.rotateY * 2);
                }}
                onMouseEnter={() => setParallaxDepth(0)}
                onMouseLeave={() => setParallaxDepth(props.translateZ)}
            >
                <Stack pos='relative' w='100%' h='100%'>
                    {
                        Array(props.depth).fill(0).map((_, i) => {
                            return (
                                <div
                                    style={{
                                        rotate: `${props.rotateZ}deg`,
                                        transform: `perspective(1000px) 
                                                rotateX(${tiltAngleX}deg) 
                                                rotateY(${tiltAngleY}deg) 
                                                scale3d(1, 1, 1) 
                                                translate3d(
                                                    ${(props.depth - i) * (- tiltAngleY / 10)}px, 
                                                    ${(props.depth - i) * tiltAngleX / 10 - 10 * +(props.blocktype === 'icon')}px, 
                                                    ${-(props.depth - i) * 3}px)`,
                                        position: 'absolute',
                                        willChange: 'transform',
                                        transition: '400ms cubic-bezier(0.03, 0.98, 0.52, 0.99)',
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '10px',
                                        filter: `brightness(0.5) ${props.blocktype !== 'icon' ? `contrast(${1 - (props.depth - i) * .05})` : ''}`,
                                        mixBlendMode: props.blocktype === 'icon' ? 'luminosity' : 'luminosity',

                                    }}
                                >
                                    {
                                        props.blocktype === 'icon' ?
                                            props.children
                                            : props.blocktype === 'paragraph' || props.blocktype === 'article' ?
                                                <HighlitedBlock
                                                    glow={false}
                                                    borderWidth={5}
                                                    display={'block'}
                                                    w='100%'
                                                    h='100%'
                                                    style={{
                                                        opacity: (i) / props.depth * .2
                                                    }}
                                                    lightColor={props.lightColor}
                                                    accentColor={props.accentColor}
                                                    darkColor={props.darkColor}
                                                />
                                                :
                                                <div
                                                    style={{
                                                        borderRadius: '10px',
                                                        width: '100%',
                                                        height: '100%',
                                                        background: `linear-gradient(180deg, ${props.accentColor} 0%, ${props.darkColor}`
                                                    }}
                                                >

                                        // </div>
                                    }
                                </div>
                            )
                        })
                    }
                    <Tilt
                        trackOnWindow={deviceType === 'Desktop'}
                        gyroscope={deviceType !== 'Desktop'}
                        tiltAngleXManual={tiltAngleX}
                        tiltAngleYManual={tiltAngleY}
                        style={{
                            backdropFilter: 'blur(10px)',
                            width: '100%',
                            height: '100%',
                            rotate: `${props.rotateZ}deg`,
                            translate: 'translateZ(0px)',
                            opacity: props.blocktype === 'icon' ? 0.9 : 1,
                            mixBlendMode: props.blocktype === 'icon' ? 'luminosity' : 'normal',
                            borderRadius: '10px',
                        }}
                        onMove={({ tiltAngleX, tiltAngleY }) => {
                            setTiltAngleX(tiltAngleX)
                            setTiltAngleY(tiltAngleY)
                        }}
                    >

                        {props.children}
                    </Tilt>
                </Stack>
            </Parallax>

        </div>

    )
}

export default Object3dBlock