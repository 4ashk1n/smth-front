import { Popover, Text, type PopoverProps } from "@mantine/core"

type InfoPopoverProps = {
    level: 'warning' | 'error'
    message: string
    children: React.ReactNode
} & Omit<PopoverProps, 'children'>

const InfoPopover = ({ level, message, children, ...props }: InfoPopoverProps) => {
    return (
        <Popover {...props} radius={5} position='bottom' withArrow styles={{
            arrow: {
                border: `2px solid ${level == 'warning' ? 'yellow' : 'red'}`,
                
            },
            dropdown: {
                border: `2px solid ${level == 'warning' ? 'yellow' : 'red'}`,
                background: '#00000080',
                backdropFilter: 'blur(2px)'
            }
        }}>
            <Popover.Target>
                {children}
            </Popover.Target>
            <Popover.Dropdown>
                <Text size="sm">{message}</Text>
            </Popover.Dropdown>
        </Popover>
    )
}

export default InfoPopover
