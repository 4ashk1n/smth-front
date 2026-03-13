import { Stack, type FlexProps } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import HighlitedBlock from "../../../../shared/ui/blocks/HighlitedBlock";

import { observer } from "mobx-react";
import { useDeviceType } from "../../../../shared/lib/useDeviceType";
import type { CategoryColors } from "../../../category/types/category.types";
import { useArticleStore } from "../../contexts/article.context";
import type { Object3d } from "../../types/content.types";

type Object3dBlockProps = FlexProps & Object3d & CategoryColors & {
    blocktype: string,

}

const Object3dBlock: React.FC<Object3dBlockProps> = observer((props) => {
    const [tiltAngleX, setTiltAngleX] = useState(props.rotateX)
    const [tiltAngleY, setTiltAngleY] = useState(props.rotateY)
    const [parallaxDepth, setParallaxDepth] = useState(props.translateZ)
    const deviceType = useDeviceType();
    
    const article = useArticleStore()
    const parallaxId = useMemo(() => 'parallax-' + article.id + '-' + Math.floor(Math.random() * 100000000), [article.id])


    useEffect(() => {
        console.log('useEf')
        setTiltAngleX(props.rotateX)
        setTiltAngleY(props.rotateY)
        setParallaxDepth(props.translateZ)
    }, [props.rotateX, props.rotateY, props.translateZ, article.id])

    return (
        <div style={{
            width: '100%',
            height: '100%',
            zIndex: -1 * props.translateZ + 5,
            position: 'relative',
        }}>
            {/* <Parallax
                key={parallaxId}
                // className={"parallaxxxxxx" + props}
                translateX={[-props.translateZ * 10, props.translateZ * 10]}
                style={{
                    // filter: `blur(${parallaxDepth * 0.5}px)`,
                    transition: 'filter 200ms ease-in-out',
                    height: '100%',
                }}
                onChange={(e) => {
                    console.log(e.progress)
                    setTiltAngleX(- e.progress * props.rotateX * 2);
                    setTiltAngleY(- e.progress * props.rotateY * 2);
                }}
                onMouseEnter={() => setParallaxDepth(0)}
                onMouseLeave={() => setParallaxDepth(props.translateZ)}
            > */}
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
                                                    ${(props.depth - i) * tiltAngleX / 10 }px, 
                                                    ${-(props.depth - i) * (props.blocktype == 'icon' ? 0.5 : 3)}px)`,
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
                    {/* <Tilt
                        trackOnWindow={deviceType === 'Desktop'}
                        gyroscope={deviceType !== 'Desktop'}
                        tiltAngleXManual={tiltAngleX}
                        tiltAngleYManual={tiltAngleY}
                        style={{
                            backdropFilter: props.blocktype === 'icon' ? 'none' : 'blur(10px)',
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
                    > */}

                        {props.children}
                    {/* </Tilt> */}
                </Stack>
            {/* </Parallax> */}

        </div>

    )
})

export default Object3dBlock

// import { Stack, type FlexProps } from "@mantine/core"
// import Tilt from "react-parallax-tilt"
// import { useEffect, useState } from "react"
// import HighlitedBlock from "../../../../shared/ui/blocks/HighlitedBlock"
// import type { CategoryColors } from "../../../category/types/category.types"
// import type { Object3d } from "../../types/content.types"
// import { useDeviceType } from "../../../../shared/lib/useDeviceType"
// import { observer } from "mobx-react"
// import { useHorizontalParallax } from "../../../../shared/lib/horizontalParallaxContext"
// import {
//   motion,
//   useMotionValue,
//   useTransform,
//   useSpring,
// } from "framer-motion"

// type Object3dBlockProps = FlexProps &
//   Object3d &
//   CategoryColors & {
//     blocktype: string
//   }

// const Object3dBlock: React.FC<Object3dBlockProps> = observer((props) => {
//   const [tiltAngleX, setTiltAngleX] = useState(props.rotateX)
//   const [tiltAngleY, setTiltAngleY] = useState(props.rotateY)
//   const deviceType = useDeviceType()

//   const swipeProgress = useHorizontalParallax()

//   // базовое значение прогресса: либо MotionValue из контекста, либо 0
//   const baseProgress = swipeProgress ?? useMotionValue(0)

//   // нормализуем [-1; 1]
//   const clampedProgress = useTransform(baseProgress, (v) => {
//     const val = typeof v === "number" ? v : 0
//     return Math.max(-1, Math.min(1, val))
//   })

//   // пружина поверх прогресса — даёт инерцию
//   const springProgress = useSpring(clampedProgress, {
//     stiffness: 120,
//     damping: 18,
//     mass: 0.4,
//   })

//   // общий параллакс по X для всей фигуры (зависит от depth)
//   const swipeIntensity = 12 // px на единицу depth
//   const swipeOffsetX = useTransform(
//     springProgress,
//     (p) => p * props.depth * swipeIntensity
//   )

//   // при желании можно ещё и общий поворот по Y чуть добавить
//   const swipeTiltY = useTransform(springProgress, (p) => p * props.depth * 4)

//   useEffect(() => {
//     // при смене статьи/блока — вернуть базовые углы
//     setTiltAngleX(props.rotateX)
//     setTiltAngleY(props.rotateY)
//   }, [props.rotateX, props.rotateY, props.translateZ])

//   return (
//     <div
//       style={{
//         width: "100%",
//         height: "100%",
//         zIndex: -1 * props.translateZ + 5,
//         position: "relative",
//       }}
//     >
//       <Stack pos="relative" w="100%" h="100%">
//         {/* ВСЯ ФИГУРА ДВИГАЕТСЯ ЦЕЛИКОМ ПО X ОТ ПРУЖИНЫ */}
//         <motion.div
//           style={{
//             width: "100%",
//             height: "100%",
//             position: "relative",
//             x: swipeOffsetX,
//             willChange: "transform",
//           }}
//         >
//           {/* Задние слои — только глубина и локальный tilt, без отдельного swipe-смещения */}
//           {Array(props.depth)
//             .fill(0)
//             .map((_, i) => {
//               const layer = props.depth - i

//               return (
//                 <div
//                   key={i}
//                   style={{
//                     rotate: `${props.rotateZ}deg`,
//                     transform: `perspective(1000px)
//                         rotateX(${tiltAngleX}deg)
//                         rotateY(${tiltAngleY})deg
//                         translate3d(
//                           ${layer * (-tiltAngleY / 10)}px,
//                           ${layer * (tiltAngleX / 10)}px,
//                           ${-layer * (props.blocktype === "icon" ? 0.5 : 3)}px
//                         )`,
//                     position: "absolute",
//                     willChange: "transform",
//                     transition:
//                       "transform 400ms cubic-bezier(0.03, 0.98, 0.52, 0.99)",
//                     width: "100%",
//                     height: "100%",
//                     borderRadius: "10px",
//                     filter: `brightness(0.5) ${
//                       props.blocktype !== "icon"
//                         ? `contrast(${1 - layer * 0.05})`
//                         : ""
//                     }`,
//                     mixBlendMode:
//                       props.blocktype === "icon" ? "luminosity" : "luminosity",
//                   }}
//                 >
//                   {props.blocktype === "icon" ? (
//                     props.children
//                   ) : props.blocktype === "paragraph" ||
//                     props.blocktype === "article" ? (
//                     <HighlitedBlock
//                       glow={false}
//                       borderWidth={5}
//                       display={"block"}
//                       w="100%"
//                       h="100%"
//                       style={{
//                         opacity: i / props.depth / 5,
//                       }}
//                       lightColor={props.lightColor}
//                       accentColor={props.accentColor}
//                       darkColor={props.darkColor}
//                     />
//                   ) : (
//                     <div
//                       style={{
//                         borderRadius: "10px",
//                         width: "100%",
//                         height: "100%",
//                         background: `linear-gradient(180deg, ${props.accentColor} 0%, ${props.darkColor}`,
//                       }}
//                     />
//                   )}
//                 </div>
//               )
//             })}

//           {/* Верхний слой — тоже внутри motion.div, едет вместе со всей фигурой */}
//           <Tilt
//             trackOnWindow={deviceType === "Desktop"}
//             gyroscope={deviceType !== "Desktop"}
//             tiltAngleXManual={tiltAngleX}
//             tiltAngleYManual={tiltAngleY}
//             style={{
//               backdropFilter: props.blocktype === "icon" ? "none" : "blur(10px)",
//               width: "100%",
//               height: "100%",
//               rotate: `${props.rotateZ}deg`,
//               translate: "translateZ(0px)",
//               opacity: props.blocktype === "icon" ? 0.9 : 1,
//               mixBlendMode:
//                 props.blocktype === "icon" ? "luminosity" : "normal",
//               borderRadius: "10px",
//             }}
//             onMove={({ tiltAngleX, tiltAngleY }) => {
//               setTiltAngleX(tiltAngleX)
//               setTiltAngleY(tiltAngleY)
//             }}
//           >
//             {props.children}
//           </Tilt>
//         </motion.div>
//       </Stack>
//     </div>
//   )
// })


// export default Object3dBlock

