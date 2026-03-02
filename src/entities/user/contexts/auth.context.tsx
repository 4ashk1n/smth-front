import { createContext, useContext, useEffect, useState } from "react";
import { AuthStore } from "../stores/AuthStore";

export const AuthContext = createContext<AuthStore | null>(null);

export const useAuthStore = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthStore must be used within AuthProvider");
    }
    return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [store] = useState(() => new AuthStore());

    useEffect(() => {
        store.bootstrapAuth();
    }, [store]);

    return (
        <AuthContext.Provider value={store}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
