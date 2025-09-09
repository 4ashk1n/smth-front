import { lazy, useEffect, useRef, useState, type ComponentType } from "react"
import { Alert, Grid, ScrollArea, Skeleton, Stack, Text, TextInput, type StackProps } from "@mantine/core"
import { FiHome, FiSearch } from "react-icons/fi"
import type { IconType } from "react-icons"
import { AiOutlineHome } from "react-icons/ai"
import { BsHouse } from "react-icons/bs"
import { BiHome } from "react-icons/bi"
import { CiHome } from "react-icons/ci"
import { DiTerminal } from "react-icons/di"
import { FcHome } from "react-icons/fc"
import { FaHouse } from "react-icons/fa6"
import { GiHouse } from "react-icons/gi"
import { GoHome } from "react-icons/go"
import { GrHome } from "react-icons/gr"
import { HiHome } from "react-icons/hi2"
import { ImHome } from "react-icons/im"
import { LiaHomeSolid } from "react-icons/lia"
import { IoAlertSharp, IoHome } from "react-icons/io5"
import { LuHouse } from "react-icons/lu"
import { MdHome } from "react-icons/md"
import { PiHouse } from "react-icons/pi"
import { RxHome } from "react-icons/rx"
import { RiHome2Line } from "react-icons/ri"
import { SiTelegram } from "react-icons/si"
import { SlHome } from "react-icons/sl"
import { TbHome } from "react-icons/tb"
import { TfiHome } from "react-icons/tfi"
import { TiHome } from "react-icons/ti"
import { VscHome } from "react-icons/vsc"
import { WiDayRainMix } from "react-icons/wi"
import { CgHome } from "react-icons/cg"
import { iconComponents } from "./ReactIcon"


const IconSelectMenuItem: React.FC<{
    name: string,
    icon: IconType,
    onClick: () => void,
    isLib?: boolean
}> = (props) => {
    return (
        <Stack
            gap={5}
            p={10}
            style={{ borderRadius: '10px', cursor: 'pointer' }}
            bg={'#00000080'}
            align="center"
            justify="center"
            h={'100%'}
            onClick={() => props.onClick()}
        >
            <props.icon color="white" size={20} />
            <Text style={{ textAlign: 'center' }} lh={1} c='#ffffff80' size="sm">{props.name}</Text>
        </Stack>
    )
}

const LIMIT = 50

const IconSelectMenu: React.FC<
    StackProps & {
        setIcon: (icon: string) => void
    }
> = (props) => {
    const [icon, setIcon] = useState('')
    const [currentLibName, setCurrentLibName] = useState('')
    const [currentLib, setCurrentLib] = useState<any>({})
    const [offset, setOffset] = useState(0)
    const [keys, setKeys] = useState<string[]>([])
    const [items, setItems] = useState<{ name: string, icon: IconType }[]>([])
    const search = useRef<HTMLInputElement>(null)
    const [query, setQuery] = useState('')
    // const [scrollPosition, onScrollPositionChange] = useState({ x: 0, y: 0 });
    const ref = useRef<HTMLDivElement>(null)
    const [loading, setLoading] = useState(false)

    const [loadedContent, setLoadedContent] = useState<any>(null)

    useEffect(() => {
        if (currentLibName) {
            setLoading(true)
            const items = lazy(async () => {
                const module = await iconComponents[currentLibName]();
                return { default: <>{Object.keys(module).map(k => <Grid.Col span={6}><IconSelectMenuItem onClick={() => setIcon(k)} name={k} icon={module[k]} /></Grid.Col>)}</> } as any;
            })
            setLoadedContent(items)
        }
    }, [currentLibName])

    useEffect(() => {
        setLoading(false)
    }, [loadedContent])

    useEffect(() => {
        console.log(loading)
    }, [loading])

    useEffect(() => {
        if (icon) {
            props.setIcon(icon)
        }
    }, [icon])

    // useEffect(() => {
    //     if (keys.length > 0 && currentLib) {
    //         console.log(offset)
    //         setItems([...items, ...keys.slice(offset, offset + LIMIT).map(k => ({ name: k, icon: currentLib[k] }))])
    //     }
    // }, [keys, currentLib, offset])

    // useEffect(() => {
    //     console.log(ref.current?.clientHeight, scrollPosition.y)
    //     if ( ref.current?.clientHeight && ref.current.clientHeight - scrollPosition.y < 250 ) {
    //         setOffset(offset + LIMIT)
    //     }
    // }, [scrollPosition])

    return (
        <Stack p={20} gap={10} align="center" bg='#00000080' style={{ borderRadius: '10px', ...props.style }} {...props}>
            <Text fz={24} fw={700} c='#ffffff80'>Иконки {currentLibName && libs[currentLibName].name}</Text>
            <Alert mih={'fit-content'} variant="light" title={'Поиск на английском'} color='#ffffff' w='100%' p={10} style={{ borderRadius: '10px' }} icon={<IoAlertSharp size={20} />}>
                <Text c='#ffffff80'>
                    В данный момент поиск работает только на английском языке. Например: "home", "telegram", "cat"
                </Text>
            </Alert>
            <TextInput size='md'
                w='100%'
                ref={search}
                leftSection={<FiSearch />}
                placeholder="Поиск (англ)"
                radius={'5'}
                styles={{
                    input: {
                        backgroundColor: '#00000080',
                        color: 'white',
                        border: 'none'
                    }
                }}
            />

            <ScrollArea scrollbars={loading ? false : 'y'} h={'100%'} w={'100%'}>
                
                <Grid gutter={10}>
                    {loading &&
                        (Array(6).fill(0)).map(() =>
                            <Grid.Col span={6}>
                                <Skeleton visible={true} h='100%' w='100%' radius={10} opacity={0.2}>
                                    <IconSelectMenuItem icon={ImHome} name='loading' onClick={() => { }} />
                                </Skeleton>
                            </Grid.Col>
                        )
                    }
                    { 
                        loadedContent
                    }
                    {
                        !search.current?.value && !currentLibName ?
                            Object.keys(libs).map((lib) => {
                                return (
                                    <Grid.Col key={lib} span={6}>
                                        <IconSelectMenuItem isLib onClick={() => {setLoading(true); setCurrentLibName(lib)}} name={libs[lib].name} icon={libs[lib].icon} />
                                    </Grid.Col>
                                )
                            })
                            :
                            currentLibName && items.length > 0 ?

                                items.map((item) => {
                                    return (
                                        <Grid.Col key={item.name} span={6}>
                                            <IconSelectMenuItem name={item.name} icon={item.icon} onClick={() => { setIcon(item.name) }} />
                                        </Grid.Col>
                                    )
                                })
                                : null
                    }
                </Grid>
            </ScrollArea>

        </Stack>
    )
}

export default IconSelectMenu;

const libs: { [key: string]: { name: string, icon: IconType } } = {
    Ai: {
        name: 'Ant Design',
        icon: AiOutlineHome
    },
    Bs: {
        name: 'Bootstrap',
        icon: BsHouse
    },
    Bi: {
        name: 'BoxIcons',
        icon: BiHome
    },
    Ci: {
        name: 'Circum',
        icon: CiHome
    },
    Di: {
        name: 'Devicons',
        icon: DiTerminal
    },
    Fi: {
        name: 'Feather',
        icon: FiHome
    },
    Fc: {
        name: 'Flat Color',
        icon: FcHome
    },
    Fa: {
        name: 'Font Awesome 6',
        icon: FaHouse
    },
    Gi: {
        name: 'Game Icons',
        icon: GiHouse
    },
    Go: {
        name: 'GitHub Octicons',
        icon: GoHome
    },
    Gr: {
        name: 'Grommet',
        icon: GrHome
    },
    Hi: {
        name: 'Heroicons 2',
        icon: HiHome
    },
    Im: {
        name: 'IcoMoon',
        icon: ImHome
    },
    Lia: {
        name: 'Line Awesome',
        icon: LiaHomeSolid
    },
    Io: {
        name: 'Ionicons 5',
        icon: IoHome
    },
    Lu: {
        name: 'Lucide',
        icon: LuHouse
    },
    Md: {
        name: 'Material Design',
        icon: MdHome
    },
    Pi: {
        name: 'Phosphor',
        icon: PiHouse
    },
    Rx: {
        name: 'Radix',
        icon: RxHome
    },
    Ri: {
        name: 'Remix',
        icon: RiHome2Line
    },
    Si: {
        name: 'Simple',
        icon: SiTelegram
    },
    Sl: {
        name: 'Simple Line',
        icon: SlHome
    },
    Tb: {
        name: 'Tabler',
        icon: TbHome
    },
    Tfi: {
        name: 'Themify',
        icon: TfiHome
    },
    Ti: {
        name: 'Typicons',
        icon: TiHome
    },
    Vsc: {
        name: 'VS Code',
        icon: VscHome
    },
    Wi: {
        name: 'Weather',
        icon: WiDayRainMix
    },
    Cg: {
        name: 'css.gg',
        icon: CgHome
    },
};