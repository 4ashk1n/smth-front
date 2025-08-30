import { Center, Stack } from "@mantine/core"
import ArticleList from "../../../widgets/ArticleList/ui"

const LandingPage = () => {
    return (
        <Center w='100%'>
            <Stack maw={'1280px'} w='90%'>
                <ArticleList />
            </Stack>
        </Center>
    )
}

export default LandingPage