import { BackgroundImage, Group, Stack, Text } from "@mantine/core";
import type { GetArticleCardDTO } from "smth-shared/src/dto/article.dto";
import type { CategoryColors } from "../../../category/types/category.types";
import ReadButton from "./ReadButton";
import Tags from "./Tags";
import HighlitedBlock from "../../../../shared/ui/blocks/HighlitedBlock";


const ArticleCardLarge = (props: GetArticleCardDTO) => {
    return (
        <HighlitedBlock
            direction={'column'}
            {...props.mainCategory as CategoryColors}
            p={0}
            style={{
                backgroundImage: `url("${props.cover}")`,
                borderRadius: '10px',
                border: '1px solid #323232',
                overflow: 'hidden',
                cursor: 'pointer',
            }}
            h='100%'
            justify="space-between"
        >


            <Group
                p={'20px 40px'}
                w='100%'
                justify="space-between"
                style={{
                    background: `linear-gradient(180deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.6) 100%)`,
                    backdropFilter: 'blur(10px)',
                }}
            >
                <Stack gap={5}>
                    <Text c="white" fw={600} fz={48} lh={1}>
                        {props.title}
                    </Text>

                    <Text c="white" fz={16} lh={1} opacity={0.5}>
                        {props.description}
                    </Text>
                </Stack>

                <ReadButton
                    accentColor={props.mainCategory.accentColor}
                    darkColor={props.mainCategory.darkColor}
                    lightColor={props.mainCategory.lightColor}
                    articleId={props.id}
                />
            </Group>

            <Group
                p={'20px 40px'}
                w='100%'
            >
                <Tags
                    category={props.mainCategory.emoji + " " + props.mainCategory.name}
                    institution="НИУ ВШЭ"
                    contrast={true}
                    onClickCategory={() => { }}
                    onClickInstitution={() => { }}
                />
            </Group>

        </HighlitedBlock>
    );
}

export default ArticleCardLarge;