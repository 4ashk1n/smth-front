import './App.css'
import { createTheme, MantineProvider, ScrollArea, Stack } from '@mantine/core'
import Header from '../widgets/NavBar/ui/Header'
import '@mantine/core/styles.css';
import LandingPage from '../pages/Landing/ui';
import ArticlePage from '../pages/Article/ui';
import { createContext, useContext, useEffect, useRef, useState, type RefObject } from 'react';
import "animate.css/animate.min.css";
import { ParallaxProvider, useParallaxController } from 'react-scroll-parallax';

const THEME = createTheme({

})

export const ScrollPositionContext = createContext<{ x: number, y: number }>({ x: 0, y: 0 });

function App() {
    const [scrollPosition, onScrollPositionChange] = useState({ x: 0, y: 0 });

    const parallaxController = useParallaxController();

    return (
        <MantineProvider theme={THEME}>

            <ScrollArea scrollbars="y" onScrollCapture={() => {parallaxController?.update()}} type="scroll" h='100vh'>
                
                    {/* <ScrollPositionContext.Provider value={scrollPosition} > */}
                    <Stack id="scrollArea">
                        <Header />
                        {/* <LandingPage    /> */}

                        <ArticlePage />
                    </Stack>
                    {/* </ScrollPositionContext.Provider> */}

            </ScrollArea>

        </MantineProvider>
    )
}

export default App
