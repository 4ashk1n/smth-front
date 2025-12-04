import './App.css'
import { createTheme, MantineProvider, ScrollArea, Stack } from '@mantine/core'
import Header from '../widgets/NavBar/ui/Header'
import '@mantine/core/styles.css';
import LandingPage from '../pages/Landing/ui';
import ArticlePage from '../pages/Article/ui';
import { createContext, useContext, useEffect, useRef, useState, type RefObject } from 'react';
import "animate.css/animate.min.css";
import { ParallaxProvider, useParallaxController } from 'react-scroll-parallax';
import { BrowserRouter, Route, Routes } from 'react-router';
import NewArticlePage from '../pages/NewArticle/ui';
import '../../node_modules/react-grid-layout/css/styles.css';
import '../../node_modules/react-resizable/css/styles.css';
import '@mantine/tiptap/styles.css';
import Footer from '../widgets/NavBar/ui/Footer';

const THEME = createTheme({

})

export const ScrollPositionContext = createContext<{ x: number, y: number }>({ x: 0, y: 0 });

function App() {
    const [scrollPosition, onScrollPositionChange] = useState({ x: 0, y: 0 });
    const parallaxController = useParallaxController();

    useEffect(() => {
        // document.documentElement.requestFullscreen();
    }, [])

    return (
        <MantineProvider theme={THEME}>

            {/* <ScrollArea scrollbars="y" onScrollCapture={() => {parallaxController?.update()}} type="scroll" h='100vh'> */}

            {/* <ScrollPositionContext.Provider value={scrollPosition} > */}
            <div
                id="scrollArea"
                style={{
                    overflow: "hidden",
                    height: "100%",       
                    width: "100%",
                    display: "grid",
                    gridTemplateRows: "minmax(0, 1fr) 80px", 
                    gap: "0px",
                }}
            >

                {/* <Header /> */}
                {/* <LandingPage    /> */}

                <div style={{ position: 'relative', gridRow: '1', width: '100%', height: '100%', maxHeight: '100%' }}>
                    <BrowserRouter>
                        <Routes>
                            <Route path='/' element={<LandingPage />} />
                            <Route path='/article/:id' element={<ArticlePage />} />
                            <Route path='/article/new' element={<NewArticlePage />} />
                        </Routes>
                    </BrowserRouter>
                </div>


                <Footer />
            </div>
            {/* </ScrollPositionContext.Provider> */}

            {/* </ScrollArea> */}

        </MantineProvider>
    )
}

export default App
