import React, { useState, useEffect } from "react";
import { calculateReadingTime, formatDate, formatTime } from "../utils/helper";
import { useNavigate } from "react-router-dom";
import parse from "html-react-parser";
import { Carousel as ResponsiveCarousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.css";
import { IconButton, Paper } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

import { Category, News } from "../types/Dataprovider";
import { fetchCategories, fetchLatestNews } from "../service/api";
import CategoryList from "./CategoryList";
import { toast } from "react-toastify";

const LatestNews: React.FC = () => {
  const [latestNews, setLatestNews] = useState<News[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  useEffect(() => {
    handleFetchLatestNews();
    fetchAllCategories();
  }, []);

  const handleFetchLatestNews = async () => {
    try {
      const responseData = await fetchLatestNews();
      setLatestNews(responseData);
    } catch (error) {
      toast.error("Error fetching latest news");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllCategories = async () => {
    try {
      const response = await fetchCategories();
      setCategories(response);
    } catch (error) {
      toast.error("Error fetching categories");
    }
  };

  if (isLoading) {
    return <div>Loading.......</div>;
  }

  if (latestNews.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-4xl font-semibold text-gray-700">
          No news available
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-5 py-2 mb-5">
      <h1 className="text-lg font-bold mb-1 underline">Latest News</h1>
      <div className="mx-auto">
        <div className="md:flex md:max-h-[calc(100vh-30px)]">
          {/* Main Featured News Slider */}
          <div className="md:w-2/3 p-4 ">
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
                      bgcolor: "rgba(0,0,0,0.4)",
                      color: "white",
                      zIndex: 10,
                      "&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
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
                      bgcolor: "rgba(0,0,0,0.4)",
                      color: "white",
                      zIndex: 10,
                      "&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
                    }}
                  >
                    <ArrowForwardIos />
                  </IconButton>
                )
              }
            >
              {latestNews.slice(0, 8).map((news) => (
                <Paper
                  key={news._id}
                  onClick={() => navigate(`/news/${news._id}`)}
                  className="bg-white p-0 rounded-lg shadow-md cursor-pointer"
                  sx={{ minHeight: 400 }}
                >
                  {news.images?.length > 0 && (
                    <img
                      src={news.images[0] || "/default-image.jpg"} // Provide a default image if none exists
                      alt={news.title || "News Image"} // Provide a default alt text
                      className="w-full h-96 object-cover rounded-lg mb-2"
                    />
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-500">
                        &bull; {formatDate(news.date || "")} at{" "}
                        {formatTime(news.time || "")}
                        <span className="text-gray-600">
                          {" "}
                          &bull; {calculateReadingTime(
                            news.description || ""
                          )}{" "}
                          min read
                        </span>
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-left">
                      {news.title || "No Title"}
                    </h2>
                    <div className="text-gray-700 text-left mb-5">
                      {parse(
                        news.description?.substring(0, 100) ||
                          "No description available..."
                      )}
                    </div>
                  </div>
                </Paper>
              ))}
            </ResponsiveCarousel>
          </div>

          {/* Side Section for Categories */}
          <div className="w-full md:w-1/3 p-4 space-y-4 max-h-full md:h-[calc(100vh-50px)] overflow-y-auto">
            {categories.map((category) => (
              <CategoryList
                key={category._id}
                category={category}
                onClick={() => navigate(`/category/${category.name}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestNews;
