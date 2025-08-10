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

export interface Comment  { 
  _id:string;
  text:string;
  date:string;
  user:User;
  news:{title:string};
}

export interface CommentsProps{
  newsId:string;
  comments:Comment[];
  fetchNewsDetails:()=>void;
}

export interface News {
  _id: string;
  title: string;
  description: string;
  images : string[];
  category : Category;
  date: string;
  time : string;
  tags:string[];
  visibility: string;
  youtubeUrl  : string;
  views : number;
  comments : Comment[]
}

export interface SavedNewsId {
  id: string
}
