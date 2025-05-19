import axios from "axios";
import { Category } from "../types/Dataprovider";

const API_BASE_URL = "http://localhost:3000"
console.log(import.meta.env.REACT_APP_API_BASE_URL)
const apiClient = axios.create({
    baseURL: API_BASE_URL,
})

export const login = async (email:string , password:string) =>{
    const response = await apiClient.post(`/api/auth/login`,{ email, password});
    localStorage.setItem("token",response.data.token);
    setAuthToken(response.data.token)
    return response.data;
}

export const register = async (name:string,email:string , password:string, role:string) =>{
    const response = await apiClient.post(`/api/auth/register`, {
        name,
        email,
        password,
        role,
      });
    return response.data;
}

export const logout = () =>{
    return apiClient.post(`/api/auth/logout`);
}

export const getUser = async () =>{
    const response = await apiClient.get(`/api/auth/user`);
    return response.data;
}

const setAuthToken = (token:string) =>{
    if(token){
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`
    }else {
        delete apiClient.defaults.headers.common["Authorization"] ;
    }
}

export const fetchCategories = async () : Promise<Category[]> => {
    const  response  = await apiClient.get("/api/categories");
    return response.data as Category[];

}

export const fetchSubcribedCategories = async() : Promise<Category[]> => {

    const response = await apiClient.get("/api/categories/subscribed-categories");
    return response.data as Category[];

}

export const subscribeCategory = async (categoryId : string): Promise<Category > => {
    const response = await apiClient.post(`/api/categories/subscribe`,{categoryId});
    return response.data as Category;
}


export const unSubscribeCategory = async (categoryId : string): Promise<Category > => {

    const response = await apiClient.post("/api/categories/unsubscribe", {categoryId});
    return response.data as Category;

}