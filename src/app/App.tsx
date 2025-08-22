import './App.css'
import { createTheme, MantineProvider } from '@mantine/core'
import Header from '../widgets/NavBar/ui/Header'
import '@mantine/core/styles.css';
import LandingPage from '../pages/Landing/ui';

const THEME = createTheme({
    
})

function App() {
    return (
        <MantineProvider theme={THEME}>
            <Header />
            <LandingPage    />
        </MantineProvider>
    )
}

export default App
