import {useContext, createContext, useState, useEffect, ReactNode} from "react";

interface AuthContextType {
    loggedIn: boolean;
    login: (token: string) => void;
    logout: () => void;
}



interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({
    loggedIn: false,
    login: () => {},
    logout: () => {},
});


export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("token");
        setLoggedIn(!!isLoggedIn);
    }, []);

    const login = (token: string) => {
        localStorage.setItem("token", token);
        setLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ loggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => useContext(AuthContext);