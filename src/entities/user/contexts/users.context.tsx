import { createContext, useContext, useState } from "react"
import { UsersStore } from "../stores/UsersStore"

export const UsersContext = createContext<UsersStore | null>(null)

export const useUsersStore = () => {
    const context = useContext(UsersContext)
    if (!context) {
        throw new Error("useUsersStore must be used within UsersProvider")
    }
    return context
}

const UsersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [store] = useState(() => new UsersStore())

    return (
        <UsersContext.Provider value={store}>
            {children}
        </UsersContext.Provider>
    )
}

export default UsersProvider
