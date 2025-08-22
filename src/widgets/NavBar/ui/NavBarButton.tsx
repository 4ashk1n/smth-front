import { Anchor } from "@mantine/core";


const NavBarButton: React.FC<{
    label: string,
    url: string
}> = ({label, url}) => {

    return (
        <Anchor 
            c={'white'}
            opacity={url === window.location.pathname ? 1 : 0.5} 
            size="lg" 
            href={url}
            style={{textDecoration: 'none'}}
            className="transition ease-in-out duration-100 hover:opacity-100! hover:text-shadow-[0_0_10px_rgb(255_255_255)]"
        >
            {label}
        </Anchor>
    )
}

export default NavBarButton;