import { Center, Grid, GridCol, Stack, Text } from "@mantine/core"
import type React from "react"
import type { ReactNode } from "react"
import { PiBell, PiBellFill, PiHouse, PiHouseFill, PiMagnifyingGlass, PiMagnifyingGlassBold, PiPlusBold, PiUser, PiUserFill } from "react-icons/pi"
import { useLocation, useNavigate } from "react-router"
import { useAuthStore } from "../../../entities/user/contexts/auth.context"

const FooterButton: React.FC<{
    icon: ReactNode
    label: string
    url: string
}> = (props) => {

    const navigate = useNavigate()
    const location = useLocation()

    return (<>
        <GridCol span={1} onClick={() => navigate(props.url)}>
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
                        fw={location.pathname === props.url ? '500' : 'normal'}
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
    const location = useLocation()

    const authUser = useAuthStore()

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
                icon={location.pathname === '/feed' ? <PiHouseFill size={20} color="white" /> : <PiHouse size={20} color="white" />}
                label={'Лента'}
                url={'/feed'} />

            <FooterButton
                icon={location.pathname  === '/search' ? <PiMagnifyingGlassBold size={20} color="white" /> : <PiMagnifyingGlass size={20} color="white" />}
                label={'Поиск'}
                url={'/search'} />

            <FooterButton
                icon={<NewArticleIcon />}
                label={''}
                url={'/workshop'} />

            <FooterButton
                icon={location.pathname === '/notifications' ? <PiBellFill size={20} color="white" /> : <PiBell size={20} color="white" />}
                label={'Уведомления'}
                url={'/notifications'} />

            <FooterButton
                icon={location.pathname === (authUser.user ? `/profile/${authUser.user.id}` : '/auth') ? <PiUserFill size={20} color="white" /> : <PiUser size={20} color="white" />}
                label={'Профиль'}
                url={authUser.user ? `/profile/${authUser.user.id}` : '/auth'} />



        </Grid>

    </>)
}

export default Footer