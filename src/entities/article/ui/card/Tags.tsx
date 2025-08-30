import { Anchor, Group, Text } from "@mantine/core";

type Props = {
    onClickCategory: () => void;
    onClickInstitution: () => void;
    category: string;
    institution: string;
    contrast: boolean;
}

const Tags = (props: Props) => {
    return <Group gap={10} opacity={props.contrast ? 1 : 0.5}>
        <Anchor c='white' size="12px" underline="hover" onClick={props.onClickCategory}>
            {props.category}
        </Anchor>
        <Text c='white' size="12px">•</Text>
        <Anchor c='white' size="12px" underline="hover" onClick={props.onClickInstitution}>
            🎓 {props.institution}
        </Anchor>
    </Group>
}

export default Tags;