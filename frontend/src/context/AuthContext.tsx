import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    getUser,
  
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
} from "../service/api";
import { User } from "../types/Dataprovider";

interface AuthContextProps {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: string
  ) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
    const [user, setUser] = useState<User | null>(null);
const [loading, setLoading] = useState(true);
const navigate = useNavigate();

useEffect (()=>{
    const fetchUser = async () =>{
        try{
            const userData = await getUser();
            console.log(userData);
            setUser(userData)
        } catch(error) {
            console.log("Error in getting current user", error);
            setUser(null);
        }finally{
            setLoading(false)
        }
    }

    fetchUser();

},[])

const login = async (email: string, password: string) => {
    const userData = await apiLogin(email, password);
    console.log(userData);
    setUser(() => userData.result);
    navigate('/');
  };

  const register = async (name: string , email: string, password: string, role: string) =>{
const userData = await apiRegister(name, email,password,role);
setUser(userData);
navigate('/')

  }

  const logout = () =>{
    apiLogout();
    setUser(null);
    navigate('/login');
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
  
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };
  
