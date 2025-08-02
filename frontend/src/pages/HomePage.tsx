import React,{useState , useEffect} from 'react'
import { News } from '../types/Dataprovider'
import { useNavigate } from 'react-router-dom'
import { fetchNews } from '../service/api'
import { toast } from 'react-toastify'
import Marquee from "react-fast-marquee"
import LatestNews from '../components/LatestNews'
import TrendingNews from '../components/TrendingNews'
import NewsList from '../components/NewsList'
const HomePage = () => {
  const [newsList,setNewsList] = useState<News[]>([])
  const [isLoading, setIsLoading] =  useState<boolean>(true)
 const navigate = useNavigate();
  const fetchFilteredNews = async()=>{
    setIsLoading(true)
    try {
      const response = await fetchNews({visibility:"public"});
      setNewsList(response);
      
    } catch (error) {
      toast.error("Errro fetching news");
    }
    finally{
      setIsLoading(false);
    }
  }

  useEffect(()=>{
    fetchFilteredNews();
  },[]);

  const lastFiveNewsTitles = newsList.slice(0,5).map((news)=>news.title);
  return (
    <div className='m-0 p-0'>
      <Marquee 
      gradient={false}
      speed={50}
      direction='left'
      style={{
        backgroundColor:"#9DBDFF",
        color:"black",
        padding:"10px",
        fontWeight:"bold",
        fontSize:"20px"
      }}
      
      >
        {lastFiveNewsTitles.map((title,index)=>(
          <span key={index} style={{marginRight:"40px"}}> &bull; {title}</span>
        ))}


      </Marquee>
      <LatestNews />
      <TrendingNews />

      <NewsList newsList={newsList} isLoading={isLoading } />
      <p  onClick={()=> navigate("/all-news")} className='text-blue-500 underline text-xl cursor-pointer text-right mx-5'>
        {`see all ->`}
      </p>


    </div>
  )
}

export default HomePage