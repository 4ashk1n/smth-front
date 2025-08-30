import { Stack } from "@mantine/core";
import type { Col } from "../../../entities/article/types/blocks/Col";
import type { Category } from "../../../entities/category/types/Category";
import type { CategoryColors } from "../../../entities/category/types/CategoryColors";
import { ArticleBlock } from ".";

const ColBlock: React.FC<{ block: Col, mainCategory: CategoryColors }> = (props) => {
    return (
        <Stack h='100%' align="center" justify="center">
            {props.block.children.map((block, i) => <ArticleBlock block={block} mainCategory={props.mainCategory} />)}
        </Stack>
    )
}

export default ColBlock