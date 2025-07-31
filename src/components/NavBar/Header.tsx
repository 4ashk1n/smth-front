import { Center, Divider, Group, Text } from "@mantine/core";
import SMTH_Button from "../Global/SMTH_Button";


const Header: React.FC = () => {
    return (
        <Group wrap="nowrap" pos='relative' h='120px' w={'100%'} justify="space-between">
            <Divider style={{zIndex: '0'}} color={'#323232'} h='1px' w='100vw' pos={'absolute'} top='50%' />

            <SMTH_Button withBorder size="lg" ml='40px'>
                Поиск
            </SMTH_Button>

            <Group gap={100} wrap="nowrap">
                <Group wrap="nowrap" w='100%' gap={60}>
                    <SMTH_Button withBorder size="lg">
                        Каталог
                    </SMTH_Button>
                    <SMTH_Button withBorder size="lg">
                        Участие
                    </SMTH_Button>
                </Group>

                <SMTH_Button radius={'100%'} size="lg" withBorder w='100px' miw={'100px'} h='100px'>
                    <Text size="64px" c='white'>?</Text>
                </SMTH_Button>

                <Group wrap="nowrap" w='100%' gap={60}>
                    <SMTH_Button withBorder size="lg">
                        О нас
                    </SMTH_Button>
                    <SMTH_Button withBorder size="lg">
                        FAQ
                    </SMTH_Button>
                </Group>
            </Group>

            <SMTH_Button withBorder size="lg" mr='40px'>
                Вход
            </SMTH_Button>
        </Group>

    )
}

export default Header;