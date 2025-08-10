import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import parse from "html-react-parser";
import { Carousel as ResponsiveCarousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.css";
import { calculateReadingTime, formatDate, formatTime } from "../utils/helper";
import YouTube from "react-youtube";
import CategoryIcon from "@mui/icons-material/Category";
import Loader from "../components/Loader";
import {
  fetchNewsById,
  fetchRelatedNews,
  fetchSavedNews,
  fetchTrendingNews,
  savedNewsbyId,
  unsaveNewsbyId,
} from "../service/api";
import { Comment, News, SavedNewsId } from "../types/Dataprovider";
import { IconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import Comments from "../components/Comments";

const NewsDetails = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [news, setNews] = useState<News | null>(null);
  const [relatableNews, setRelatableNews] = useState<News[]>([]);
  const [trendingNews, setTrendingNews] = useState<News[]>([]);
  const [comments,setComments] =  useState<Comment[]>([]);
  const [isSaved , setIsSaved] =  useState<boolean>(false)
  const [isDescriptionExpanded, setIsDescriptionExpended] =
    useState<boolean>(false);
  const [readingTime, setReadingTime] = useState<number | null>(null);
  const { isAuthenticated, user, loading } = useAuth();

  const navigate = useNavigate();

  const fetchNewsDetails = async () => {
    try {
      let savedNewsIds;
      const responseData = await fetchNewsById(id || "");
      setNews(responseData);

      if(!loading && isAuthenticated){
        const savedResponse = await fetchSavedNews();

        savedNewsIds =  savedResponse.map((id:SavedNewsId)=>id.id)
        setIsSaved(savedNewsIds.includes(id as string ))
      }

      if (responseData.description) {
        const timeToRead = calculateReadingTime(responseData.description);
        setReadingTime(timeToRead);
      }
      setComments(responseData.comments)
    } catch (error) {
      console.log("Error fetching News Details", error);
      toast.error("Error Fetching News Details");
    }
  };

  const fetchRelatableNews = async (newsId: string) => {
    try {
      const responseData = await fetchRelatedNews(newsId);
      setRelatableNews(responseData);
    } catch (error) {
      console.error("Error fetching related news", error);
      toast.error("Error fetching related news");
    }
  };

  const fetchAllTrendingNews = async () => {
    try {
      const responseData = await fetchTrendingNews();
      setTrendingNews(responseData);
    } catch (error) {
      console.error("Error fetching Trending News", error);
      toast.error("Error fething Trending News");
    }
  };

  useEffect(() => {
    if (id) {
      fetchRelatableNews(id);
    }
  }, [id]);

  useEffect(() => {
    fetchAllTrendingNews();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchNewsDetails();
    }
  }, [id, isAuthenticated, loading]);

  useEffect(() => {
    if (news && location.pathname.includes("/news/")) {
      document.title = `${news.title} - Shot News`;
    } else {
      document.title = "Shot News";
    }
  }, [news, location]);

  function extractVideoId(url: string) {
    const regex =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  const handleSaveToggle = async()=>{
    if(!isAuthenticated){
      toast.error("please login to save news")
      navigate("/login")
      return;
    }

    try {
      if(isSaved){
        await unsaveNewsbyId(id || "")
        toast.success("News has been unsaved")
      } else{
        await savedNewsbyId(id || "")
        toast.success("News has been saved")
      }

      setIsSaved(!isSaved)
      
    } catch (error) {

      console.error("error saving news",error)
      toast.error("Failed to save/unsave news")
      
    }
  }

  if (!news) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader loading={!news} />
      </div>
    );
  }
  return (
    <div className="w-full p-2 flex felx-wrap lg:flex-nowrap">
      <div className="w-full lg:w-3/4 p-4">
        <div className="bg-white shadow-md rounded-lg p-6 ">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{news.title}</h1>
              <p className="text-blue-500 mt-2 font-bold">
                {readingTime && (
                  <span className="text-gray-600">
                    {readingTime} min read &bull;{" "}
                  </span>
                )}
                {formatDate(news.date)} &bull; {formatTime(news.time)}
                <span className="text-orange-600">
                  {" "}
                  &bull; {news.views} views
                </span>
              </p>
            </div>
            {user?.role === "subscriber" && (
              <button
              onClick={handleSaveToggle}
              className={`text-2xl cursor-pointer ${isSaved ? "text-red-500":"text-gray-500"}`}
              aria-label={isSaved ? "Unsave":"Save"}
              >

                {isSaved ? <FaBookmark /> : <FaRegBookmark />}
              </button>
            )}
         
          </div>
          <div className="mb-4">
            {news.images.length > 1 ? (
              <ResponsiveCarousel
                showArrows
                showStatus={false}
                showThumbs={false}
                infiniteLoop
                autoPlay
                interval={5000}
                transitionTime={300}
                swipeable
                renderArrowPrev={(onClick, hasPrev) =>
                  hasPrev && (
                    <IconButton
                      onClick={onClick}
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: 8,
                        transform: "translateY(-50%)",
                        bgColor: "rgba(0,0,0,0.4)",
                        color: "white",
                        zIndex: 10,
                        "&:hover": { bgColor: "rgba(0,0,0,0.6)" },
                      }}
                    >
                      <ArrowBackIos />
                    </IconButton>
                  )
                }
                renderArrowNext={(onClick, hasNext) =>
                  hasNext && (
                    <IconButton
                      onClick={onClick}
                      sx={{
                        position: "absolute",
                        top: "50%",
                        right: 8,
                        transform: "translateY(-50%)",
                        bgColor: "rgba(0,0,0,0.4)",
                        color: "white",
                        zIndex: 10,
                        "&:hover": { bgColor: "rgba(0,0,0,0.6)" },
                      }}
                    >
                      {" "}
                      <ArrowForwardIos />
                    </IconButton>
                  )
                }
              >
                {news.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`news-${index}`}
                    className="w-full rounded mb-4 object-cover h-[400px] object-center"
                  />
                ))}
              </ResponsiveCarousel>
            ) : (
              <img
                src={news.images[0]}
                alt={"news-0"}
                className="w-full rounded mb-4 object-fill h-[400px] object-center"
              />
            )}
          </div>

          <div className="mb-4">
            {isDescriptionExpanded ? (
              parse(news.description || "No description available...")
            ) : (
              <div>
                {parse(news.description.substring(0, 400)) ||
                  "No description available..."}
                ...
                <button
                  className="text-blue-500 hover:underline ml-2"
                  onClick={() => setIsDescriptionExpended(true)}
                >
                  Read More
                </button>
              </div>
            )}
          </div>

          <div className="mb-4">
            <span className="font-semibold">Category:</span>
            {news.category.name || "No Category"}
          </div>

          <div className="mb-4">
            <div className="flex items-center">
              <span className="font-semibold mr-2 mb-3">Tags:</span>
              <div className="flex flex-wrap">
                {news.tags &&
                Array.isArray(news.tags) &&
                news.tags.length > 0 ? (
                  news.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-200 rounded-full px-3 text-sm font-semibold text-gray-700 mr-2 mb-2"
                    >
                      {"#" + tag}
                    </span>
                  ))
                ) : (
                  <span className="mb-2 font-semibold text-gray-500">
                    No Tags{" "}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <span className="font-semibold">Visibility: </span>
            {news.visibility || "Unknown"}
          </div>
          {/* Youtube Video Section  */}
          {!news.youtubeUrl || news.youtubeUrl === "undefined" ? null : (
            <div className="mb-4">
              <div className="relative w-full pb-[56.25%]">
                {" "}
                <YouTube
                  className="absolute top-0 left-0 w-full h-full"
                  videoId={extractVideoId(news.youtubeUrl) || undefined}
                  opts={{
                    height: "100%",
                    width: "100%",
                  }}
                />
              </div>
            </div>
          )}

          {/* Related News Section  */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Relatable News</h2>
            {relatableNews.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatableNews.map((newsItem) => (
                  <div
                    key={newsItem._id}
                    onClick={() => {
                      setIsDescriptionExpended(false);
                      navigate(`/news/${newsItem._id}`);
                    }}
                    className="bg-white cursor-pointer rounded-md shadow-md flex flex-col gap-1 transition-transform transform hover:scale-105"
                  >
                    <img
                      src={newsItem.images[0]}
                      alt={newsItem.title}
                      className="w-full h-40 object-cover mb-1"
                    />
                    <div className="p-2 pt-0">
                      <div className="flex  justify-between text-xs text-right">
                        <p className="text-orange-600 font-bold flex">
                          <CategoryIcon sx={{ fontSize: 16 }} />{" "}
                          {news.category.name || "No category"}{" "}
                        </p>

                        <p className="text-gray-600 font-bold text-xs mb-1">
                          {" "}
                          &bull; {calculateReadingTime(news.description)} min
                          read{" "}
                        </p>
                      </div>
                      <p className="text-blue-500 text-xs mt-1 font-bold">
                        &bull; {formatDate(newsItem.date) || "Unknown Date"} at{" "}
                        {formatTime(newsItem.time) || "unknown time"}
                      </p>

                      <h3 className="tetx-lg font-semibold mb-2">
                        {newsItem.title || " No Title"}
                      </h3>
                      <div className="text-gray-600 text-sm mb-2">
                        {parse(newsItem.description.substring(0, 100)) ||
                          "No description available...."}
                        ....
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center font-bold text-xl">
                No Relatable News Available{" "}
              </p>
            )}
          </div>
          <div className="mt-8">{id? <Comments newsId={id} comments={comments} fetchNewsDetails={fetchNewsDetails} />: null}</div>
        </div>
      </div>
      <div className="w-full lg:w-1/3 p-4 space-y-4">
        <h2 className="text-2xl font-bold mb-1 underline">Trending News</h2>
        {trendingNews.slice(0, 4).map((newsItem) => (
          <div
            key={newsItem._id}
            onClick={() => {
              navigate(`/news/${newsItem._id}`);
              setIsDescriptionExpended(false);
            }}
            className="bg-white rounded-lg cursor-pointer shadow-md flex h-36 transition-transform transform hover:scale-105"
          >
            {newsItem.images.length > 0 && (
              <img
                src={newsItem.images[0]}
                alt={newsItem.title}
                className="w-1/3 object-cover rounded-l-lg h-full"
              />
            )}
            <div className="p-2 flex flex-col justify-between w-2/3">
              <h3 className="text-lg font-bold mb-1 line-clamp-2">
                {newsItem.title || "No Title"}
              </h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-blue-500 font-bold text-xs">
                  &bull; {formatDate(newsItem.date) || "Unknown date"} at{" "}
                  {formatTime(newsItem.time) || "Unknown Time"}{" "}
                  <span>
                    {" "}
                    &bull; {calculateReadingTime(newsItem.description)} min read
                  </span>
                </span>
              </div>
              <div className="text-gray-600 text-sm line-clamp-2">
                {parse(newsItem.description.substring(0, 100)) ||
                  "No description available...."}
                ....
              </div>
            </div>
          </div>
        ))}

        {
            trendingNews.length > 4 && (
                <div
                onClick={()=>{
                    navigate("/all-news")
                    setIsDescriptionExpended(false)
                }}
                className="bg-white p-4 rounded-lg shadow-md flex cursor-pointer justify-center items-center"
                
                >
                    <p className="text-gray-600">More News...</p>
                    
                     </div>
            )
        }
      </div>
    </div>
  );
};

export default NewsDetails;
