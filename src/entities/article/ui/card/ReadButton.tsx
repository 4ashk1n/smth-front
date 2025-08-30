import { hex_to_rgba } from "../../../../shared/lib/hex_to_rgba"
import { Button, type ButtonProps } from "@mantine/core"
import type { CategoryColors } from "../../../category/types/CategoryColors"


const ReadButton = (props: CategoryColors & ButtonProps) => {
    return (
        <Button 
            variant="subtle" 
            c={props.accentColor}
            color={props.accentColor} 
            fz={16}
            p={'10px 20px'}
            w='fit-content'
            style={{
                boxShadow: `0px 0px 5px 0px ${hex_to_rgba(props.lightColor, 0.25)}`,
            }}
            className={`hover:bg-[${props.darkColor}]`}
            radius="xl" 
            size="sm"
            {...props}
        >
            Читать
        </Button>
    )
}

export default ReadButton