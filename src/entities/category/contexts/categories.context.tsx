import { createContext, useContext, useEffect, useState } from "react"
import { CategoriesStore } from "../stores/CategoriesStore"

const CategoriesContext = createContext<CategoriesStore | null>(null)

export const useCategoriesStore = () => {
    const context = useContext(CategoriesContext)
    if (!context) {
        throw new Error("useCategoriesStore must be used within CategoriesProvider")
    }
    return context
}

const CategoriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [store] = useState(() => new CategoriesStore())

    useEffect(() => {
        store.fetchAll().catch((error) => {
            console.error("Failed to preload categories", error)
        })
    }, [store])

    return (
        <CategoriesContext.Provider value={store}>
            {children}
        </CategoriesContext.Provider>
    )
}

export default CategoriesProvider
