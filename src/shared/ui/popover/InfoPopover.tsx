import { ActionIcon, Group, Popover, Text, type PopoverProps } from "@mantine/core"
import { PiXBold } from "react-icons/pi";

type InfoPopoverProps = {
    level: 'warning' | 'error'
    message: React.ReactNode
    children: React.ReactNode
    onClose?: () => void
    showCloseButton?: boolean
} & Omit<PopoverProps, 'children'>

const InfoPopover = ({ level, message, children, onClose, showCloseButton, ...props }: InfoPopoverProps) => {
    const color = level == 'warning' ? 'yellow' : 'red';
    const shouldShowCloseButton = showCloseButton ?? Boolean(onClose);

    return (
        <Popover {...props} radius={5} position='bottom' withArrow styles={{
            arrow: {
                border: `2px solid ${color}`,
                
            },
            dropdown: {
                border: `2px solid ${color}`,
                background: '#00000080',
                backdropFilter: 'blur(2px)',
                maxWidth: 'min(90vw, 360px)',
            }
        }}>
            <Popover.Target>
                {children}
            </Popover.Target>
            <Popover.Dropdown>
                <Group justify="space-between" align="flex-start" wrap="nowrap" gap={8}>
                    {typeof message === "string" ? (
                        <Text size="sm" style={{ whiteSpace: "normal", overflowWrap: "anywhere", wordBreak: "break-word" }}>
                            {message}
                        </Text>
                    ) : (
                        <div style={{ whiteSpace: "normal", overflowWrap: "anywhere", wordBreak: "break-word", maxWidth: "100%" }}>
                            {message}
                        </div>
                    )}
                    {shouldShowCloseButton && (
                        <ActionIcon
                            size="xs"
                            variant="subtle"
                            color={color}
                            onClick={onClose}
                            aria-label="Close info popover"
                        >
                            <PiXBold size={12} />
                        </ActionIcon>
                    )}
                </Group>
            </Popover.Dropdown>
        </Popover>
    )
}

export default InfoPopover
