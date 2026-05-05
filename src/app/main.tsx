import { createContext, useState } from 'react'
import { createRoot } from 'react-dom/client'
import CategoriesProvider from '../entities/category/contexts/categories.context.tsx'
import AuthProvider from '../entities/user/contexts/auth.context.tsx'
import UsersProvider from '../entities/user/contexts/users.context.tsx'
import App from './App.tsx'
import './index.css'

export const GlobalContext = createContext<{
  setScrollContainer: (container: HTMLDivElement) => void
}>({
  setScrollContainer: () => { },
})

const AppContainer = () => {
  const [_, setScrollContainer] = useState<HTMLDivElement | undefined>(undefined)

  return (
    <GlobalContext.Provider value={{ setScrollContainer }}>
      <CategoriesProvider>
        <UsersProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </UsersProvider>
      </CategoriesProvider>
    </GlobalContext.Provider>
  )
}

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <AppContainer />
  // </StrictMode>,
)

