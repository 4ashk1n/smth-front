import { Button, type ButtonProps } from "@mantine/core"

type ExtendedButtonProps = ButtonProps & {
    withBorder?: boolean
}

const SMTH_Button: React.FC<ExtendedButtonProps> = (props) => {
    return (
        <Button 
            radius={'xl'}
            bg='black'
            {...props}
            style={{
                boxShadow: `0px 0px ${props.size === 'lg' ? '30' : '5'}px 0px #FFFFFF40`,
                border: props.withBorder ? '1px solid white' : 'none',
                zIndex: '1'
            }}
            className='transition-[filter] transition-transform ease-in-out duration-100 hover:invert hover:scale-95'
        />
    )
}

export default SMTH_Button