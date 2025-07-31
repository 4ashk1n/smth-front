import './App.css'
import { createTheme, MantineProvider } from '@mantine/core'
import Header from './components/NavBar/Header'
import '@mantine/core/styles.css';

const THEME = createTheme({
    
})

function App() {
    return (
        <MantineProvider theme={THEME}>
            <Header />
        </MantineProvider>
    )
}

export default App
