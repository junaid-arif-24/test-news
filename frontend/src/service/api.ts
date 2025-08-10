import axios from "axios";
import { Category, News, SavedNewsId ,Comment, User} from "../types/Dataprovider";

const API_BASE_URL = "http://localhost:3000";
console.log(import.meta.env.REACT_APP_API_BASE_URL);
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});
const setAuthToken = (token: string) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};
export const login = async (email: string, password: string) => {
  const response = await apiClient.post(`/api/auth/login`, { email, password });
  localStorage.setItem("token", response.data.token);
  setAuthToken(response.data.token);
  return response.data;
};

export const register = async (
  name: string,
  email: string,
  password: string,
  role: string
) => {
  const response = await apiClient.post(`/api/auth/register`, {
    name,
    email,
    password,
    role,
  });
  return response.data;
};

export const logout = () => {
  return apiClient.post(`/api/auth/logout`);
};

export const getUser = async ():Promise<User> => {
  const token = localStorage.getItem('token') || "";
  const response = await apiClient.get(`/api/auth/user`,{
    headers:{
      Authorization : `Bearer ${token}`
    }
  });
  return response.data as User;
};

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get("/api/categories");
  return response.data as Category[];
};

// Create a category

export const createCategory = async (name: string): Promise<Category> => {
  const response = await apiClient.post("/api/categories/create", { name });
  return response.data as Category;
};

// Update a category

export const updateCategory = async (
  id: string,
  name: string
): Promise<Category> => {
  const response = await apiClient.put(`/api/categories/update/${id}`, {
    name,
  });

  return response.data as Category;
};

// Delete a category

export const deleteCategory = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/categories/delete/${id}`);
};

export const fetchSubcribedCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get("/api/categories/subscribed-categories");
  return response.data as Category[];
};

export const subscribeCategory = async (
  categoryId: string
): Promise<Category> => {
  const response = await apiClient.post(`/api/categories/subscribe`, {
    categoryId,
  });
  return response.data as Category;
};

export const unSubscribeCategory = async (
  categoryId: string
): Promise<Category> => {
  const response = await apiClient.post("/api/categories/unsubscribe", {
    categoryId,
  });
  return response.data as Category;
};

//create or update the news

export const createOrUpdateNews = async (
  formData: FormData,
  isEdit: boolean,
  newsId?: string
) => {
  const endpoint = isEdit ? `/api/news/${newsId}` : "/api/news/create";
  const method = isEdit ? "put" : "post";

  const response = await apiClient({
    url: endpoint,
    method: method,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// get all news

export const fetchNews = async (filters:{
  title?: string;
  description?: string;
  date?: string;
  tags? : string;
  category?: string
  visibility?: string
}): Promise<News[] > => {
  const response = await apiClient.get("/api/news",{
    params : {...filters}
  });
  return response.data as News[];
};

// fetch news by Id
export const fetchNewsById = async (id: string) => {
  const response = await apiClient.get(`/api/news/${id}`);
  return response.data as News;
};

//Related News Function
export const fetchRelatedNews = async(newsId:string):Promise<News[]>=>{
  const response =  await apiClient.get(`/api/news/relatable/${newsId}`);
  return response.data as News[];
}

// Latest News Function
export const fetchLatestNews = async(): Promise<News[]> =>{
  const response = await apiClient.get('/api/news/latest');
  return response.data as News[];
}

//Trending News Fucntion
export const fetchTrendingNews =async():Promise<News[]> =>{
  const response = await apiClient.get('/api/news/trending');
  return response.data as News[]
}

export const savedNewsbyId = async(id:string)=>{
  await apiClient.post(`/api/news/${id}/save`);
}

export const unsaveNewsbyId = async(id:string)=>{
  await apiClient.post(`/api/news/${id}/unsave`)
}


export const fetchSavedNews = async (): Promise<SavedNewsId[]>=>{
  const response = await apiClient.get("/api/news/savedNews")
  return response.data as SavedNewsId[];

}

//delete news

export const deleteNews = async(id:string)=>{
    await apiClient.delete(`/api/news/${id}`);
}

// Add comment 

export const createComment =  async(newsId:string, comment: string): Promise<Comment>=>{
  const response = await apiClient.post(`/api/comments/${newsId}/comments`,{text:comment })
  return response.data;
}

//Delete Comment 
export const deleteComment =  async(commentId:string)=>{
  await apiClient.delete(`/api/comments/${commentId}`)


}

// Get All Comments 

export const fetchAllComments = async(): Promise<Comment[]>=>{

const response =  await apiClient.get("/api/comments/all")
return response.data as Comment[];
}