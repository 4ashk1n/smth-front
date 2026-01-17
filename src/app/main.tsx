import { createContext, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

export const GlobalContext = createContext<{
  setScrollContainer: (container: HTMLDivElement) => void
}>({
  setScrollContainer: () => { },
})

const AppContainer = () => {
  const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | undefined>(undefined)
  useEffect(() => {
    console.log(scrollContainer)
  }, [scrollContainer])
  return (
    // <ParallaxProvider scrollAxis='horizontal'>
      <GlobalContext.Provider value={{ setScrollContainer }}>
        <App />
      </GlobalContext.Provider>
    // </ParallaxProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <AppContainer />
  // </StrictMode>,
)


// test 3