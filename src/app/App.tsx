import { Center, createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import "animate.css/animate.min.css";
import { createContext, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import '../../node_modules/react-grid-layout/css/styles.css';
import '../../node_modules/react-resizable/css/styles.css';
import ArticlePage from '../pages/Article/ui';
import FeedPage from '../pages/Feed/ui';
import LandingPage from '../pages/Landing/ui';
import NewArticlePage from '../pages/NewArticle/ui';
import NotificationsPage from '../pages/Notifications/ui';
import ProfilePage from '../pages/Profile/ui';
import ProfileSettingsPage from '../pages/Profile/ui/settings';
import SearchPage from '../pages/Search/ui';
import { WorkshopPage } from '../pages/Workshop/ui';
import AuthWidget from '../widgets/AuthWidget/ui';
import Footer from '../widgets/NavBar/ui/Footer';
import './App.css';
import './styles/editorjs.css';


const THEME = createTheme({

})

export const ScrollPositionContext = createContext<{ x: number, y: number }>({ x: 0, y: 0 });


function App() {
    const [scrollPosition, onScrollPositionChange] = useState({ x: 0, y: 0 });
    // const parallaxController = useParallaxController();

    useEffect(() => {
        // document.documentElement.requestFullscreen();
    }, [])


    return (
        // <ParallaxProvider>
        <MantineProvider theme={THEME} defaultColorScheme='dark'>

            {/* <ScrollArea scrollbars="y" onScrollCapture={() => {parallaxController?.update()}} type="scroll" h='100vh'> */}

            {/* <ScrollPositionContext.Provider value={scrollPosition} > */}
            <div
                id="scrollArea"
                style={{
                    overflow: "hidden",
                    height: "100%",
                    width: "100%",
                    display: "grid",
                    gridTemplateRows: "100%",
                    gap: "0px",
                }}
            >

                {/* <Header /> */}
                {/* <LandingPage    /> */}
                <BrowserRouter>
                    <div style={{ position: 'relative', gridRow: '1', width: '100%', height: '100%', maxHeight: '100%' }}>

                        <Routes>
                            <Route path='/' element={<LandingPage />} />
                            <Route path='/article/:id' element={<ArticlePage />} />
                            <Route path='/article/:id/edit' element={<NewArticlePage />} />
                            <Route path='/workshop' element={<WorkshopPage />} />
                            <Route path='/feed' element={<FeedPage />} />
                            <Route path='/notifications' element={<NotificationsPage />} />

                            <Route path={`/profile/:userId`} element={<ProfilePage />} />
                            <Route path={`/profile/:userId/settings`} element={<ProfileSettingsPage />} />
                            
                            <Route path={'/auth'} element={<Center w='100%' h='calc(100% - 80px)'><AuthWidget /></Center>} />
                            <Route path={'/search'} element={<SearchPage />} />
                        </Routes>
                    </div>


                    <Footer />

                </BrowserRouter>
            </div>
            {/* </ScrollPositionContext.Provider> */}

            {/* </ScrollArea> */}

        </MantineProvider>
        // </ParallaxProvider>
    )
}

export default App
