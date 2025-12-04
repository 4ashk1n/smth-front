import { Center, Stack } from "@mantine/core"
import ArticleList from "../../../widgets/ArticleList/ui"
import { useEffect } from "react"
import { useNavigate } from "react-router"

const LandingPage = () => {
    const navigate = useNavigate()
    useEffect(() => {
        navigate('/article/1')
    }, [])
    return (
        <Center w='100%'>
            <Stack maw={'1280px'} w='90%'>
                <ArticleList />
            </Stack>
        </Center>
    )
}

export default LandingPage