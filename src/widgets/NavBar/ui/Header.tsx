import { Divider, Group, Image, Text } from "@mantine/core";
import NavBarButton from "./NavBarButton";


const Header: React.FC = () => {
    return (
        <Group w={'100%'} className="pt-[10px] md:pt-[20px]" align="center" justify="center" mb={40} style={{zIndex: '11111'}}>
            <Group wrap="nowrap" pos='relative' align="start" maw={'1280px'} w='90%' justify="space-between">
                
                <Divider 
                    style={{zIndex: '0'}} 
                    color={'#323232'} 
                    h='1px' 
                    pos={'absolute'} 
                    className="top-[45px] md:top-[90px] left-[20px] md:left-[40px] w-[calc(100%_-_20px)] md:w-[calc(100%_-_40px)]"
                />
                
                
                <Image 
                    src={'/images/logo.svg'} 
                    style={{zIndex: '1'}} 
                    w='auto' 
                    className="h-[50px] md:h-[100px]"
                />


                <Image 
                    style={{zIndex: '1'}}
                    src={'/images/who1.png'} 
                    w='auto' 
                    pos='absolute' 
                    className='h-[75px] md:h-[150px] left-[50px] md:left-[100px] top-[2px] md:top-[5px]'
                />
                
                <Group visibleFrom="sm" pos='absolute' w='calc(100% - 200px)' justify="space-between" bottom={'10px'} left={200}>
                    <Group gap='40px'>
                        <NavBarButton label={'Лента'} url={'/'} />
                        <NavBarButton label={'Категории'} url={'/about'} />
                    </Group>
                    <Group gap='40px'>
                        <NavBarButton label={'Новая статья'} url={'/new'} />
                        <NavBarButton label={'Профиль'} url={'/profile'} />
                    </Group>
                </Group>
            </Group>
        </Group>

    )
}

export default Header;