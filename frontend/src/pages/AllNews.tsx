import React,{useState,useEffect} from 'react';
import { News } from '../types/Dataprovider';
import { fetchNews } from '../service/api';
import {toast} from 'react-toastify'
import NewsList from '../components/NewsList';
import SearchFilters from '../components/SearchFilters';

const AllNews = () => {
    const [newsList ,setNewsList] = useState<News[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);


    const fetchFilteredNews = async()=>{
        setIsLoading(true)
        try {
            const news =  await fetchNews({visibility:"public"});
            setNewsList(news);
            
        } catch (error) {
            toast.error("Error Fetching news")
            
        } finally{
            setIsLoading(false)
        }
    }

useEffect(()=>{
    fetchFilteredNews()

},[])

  return (
    <>
    <SearchFilters setNewsList={setNewsList} />

        <h1 className='text-lg font-bold m-3 underline'>All News</h1>
        <NewsList newsList={newsList}  isLoading={isLoading}/>
    </>
  )
}

export default AllNews