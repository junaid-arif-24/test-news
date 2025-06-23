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

export interface Comments  { 
  _id:string;
  text:string;
  date:string;
  user:User;
  news:{title:string};
}

export interface News {
  _id: string;
  title: string;
  description: string;
  images : string[];
  category : Category;
  time : string;
  tags:string[];
  visibility: string;
  youtubeUrl  : string;
  views : number;
  comments : Comment[]
}
