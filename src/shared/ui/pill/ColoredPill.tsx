import { Group, Image as MantineImage, Text } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { getImageColor } from "../../lib/getImageColor";

export type ColoredPillProps = {
    label?: string,
    image?: string,
    color?: string,
    size: 'sm' | 'md' | 'lg',
    url?: string,
}

const ColoredPill: React.FC<ColoredPillProps> = (props) => {
    const [color, setColor] = useState<string>('');
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (props.color) setColor(props.color);
        (async () => {
            if (!props.image) return;
            const color = await getImageColor(props.image, .5);
            setColor(color);
        })()
    }, [])


    return (
        <Group p={props.size === 'sm' ? '5px 10px' : props.size === 'lg' ? '10px 20px' : '5px 10px'} gap={10} align="center" h='fit-content' style={{ background: color, borderRadius: '50px' }}>
            <MantineImage
                ref={imageRef}
                src={props.image}
                style={{
                    borderRadius: '50%',
                    width: props.size === 'sm' ? '15px' : props.size === 'lg' ? '30px' : '20px',
                    aspectRatio: '1/1',
                    objectFit: 'contain'
                }}
                radius='xl'
            />

            <Text
                c='white'
                size={props.size}
                style={{ textDecoration: 'none' }}
                className="transition ease-in-out duration-100 hover:text-shadow-[0_0_10px_rgb(255_255_255)]"
                onClick={() => { if (props.url) window.location.href = props.url }}
            >
                {props.label}
            </Text>
        </Group>

    )
}

export default ColoredPill;