import { useEffect } from "react"
import { useNavigate } from "react-router"

const LandingPage = () => {
    const navigate = useNavigate()
    useEffect(() => {
        navigate('/feed')
    }, [])
    return null
    // return (
    //     <Center w='100%'>
    //         <Stack maw={'1280px'} w='90%'>
    //             <ArticleList />
    //         </Stack>
    //     </Center>
    // )
}

export default LandingPage