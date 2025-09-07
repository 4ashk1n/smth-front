import { Affix, Menu, ActionIcon, Group, ThemeIcon, Text } from "@mantine/core"
import { FaPlus, FaIcons } from "react-icons/fa6"
import { IoText, IoImage } from "react-icons/io5"
import { useContext } from "react"
import { ArticleContext } from "../../stores/ArticleStore"

const AddBlockAffix: React.FC<{}> = () => {
    const { createNewBlock, categoryColors } = useContext(ArticleContext)

    return (<>
        <Affix position={{ bottom: 40, right: 40 }}>
            <Menu position="top-end" trigger="hover">
                <Menu.Target>
                    <ActionIcon
                        size="xl"
                        variant="filled"
                        autoContrast
                        color={categoryColors.accentColor}
                        style={{
                            boxShadow: '0px 0px 5px 0px #00000040'
                        }}
                    >
                        <FaPlus />
                    </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Label>Добавить блок</Menu.Label>
                    <Menu.Item onClick={() => createNewBlock('paragraph')}>
                        <Group gap={10} align="center">
                            <ThemeIcon variant="filled" autoContrast color={categoryColors.accentColor}>
                                <IoText />
                            </ThemeIcon>
                            <Text size="md" lh={1}>
                                Текст
                            </Text>
                        </Group>
                    </Menu.Item>
                    <Menu.Item onClick={() => createNewBlock('image')}>
                        <Group gap={10} align="center">
                            <ThemeIcon variant="filled" autoContrast color={categoryColors.accentColor}>
                                <IoImage />
                            </ThemeIcon>
                            <Text size="md" lh={1}>
                                Изображение
                            </Text>
                        </Group>
                    </Menu.Item>
                    <Menu.Item onClick={() => createNewBlock('icon')}>
                        <Group gap={10} align="center">
                            <ThemeIcon variant="filled" autoContrast color={categoryColors.accentColor}>
                                <FaIcons />
                            </ThemeIcon>
                            <Text size="md" lh={1}>
                                Иконка
                            </Text>
                        </Group>
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </Affix>
    </>)
}

export default AddBlockAffix