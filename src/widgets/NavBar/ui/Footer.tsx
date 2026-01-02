import { Center, Grid, GridCol, Group, Stack, Text } from "@mantine/core"
import type React from "react"
import type { IconName } from "../../../shared/icon/ReactIcon"
import type { ReactNode } from "react"
import type { IconType } from "react-icons"
import { PiBell, PiHouse, PiHouseLine, PiHouseLineBold, PiMagnifyingGlass, PiMagnifyingGlassBold, PiPlusBold, PiUser } from "react-icons/pi"

const FooterButton: React.FC<{
    icon: ReactNode
    label: string
    url: string
}> = (props) => {


    return (<>
        <GridCol span={1}>
            <Stack
                justify="center"
                align="center"
                w='100%'
                h='100%'
                gap={'4px'}
            >
                {props.icon}

                {
                    props.label !== '' &&
                    <Text
                        lh={1}
                        size="10px"
                        c='white'
                        style={{ textAlign: 'center' }}
                    >
                        {props.label}
                    </Text>
                }
            </Stack>

        </GridCol>
    </>)
}

const NewArticleIcon: React.FC = () => {
    return (<>
        <Center h={'30px'} w={'45px'} bg={"white"} style={{ borderRadius: '8px' }}>
            <PiPlusBold size={16} color="black" />
        </Center>
    </>)
}

const Footer = () => {
    return (<>

        <Grid
            h='80px'
            style={{
                zIndex: 999,
                position: 'absolute',
                bottom: 0,
                // boxShadow: '0 -5px 10px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)',
            }}
            columns={5}
            w='100%'
            align="center"
            p='8px 0px'

        >
            <FooterButton
                icon={<PiHouse size={20} color="white" />}
                label={'Лента'}
                url={'/feed'} />

            <FooterButton
                icon={<PiMagnifyingGlass size={20} color="white" />}
                label={'Поиск'}
                url={'/search'} />

            <FooterButton
                icon={<NewArticleIcon />}
                label={''}
                url={'/article/new'} />

            <FooterButton
                icon={<PiBell size={20} color="white" />}
                label={'Уведомления'}
                url={'/notifications'} />

            <FooterButton
                icon={<PiUser size={20} color="white" />}
                label={'Профиль'}
                url={'/article/new'} />



        </Grid>

    </>)
}

export default Footer