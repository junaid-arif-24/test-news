export interface User {
    _id: string,
    name: string,
    email: string,
    role: string
}

export interface Category { 
  _id: string;
  name: string ;
  newsCount: number;
}
