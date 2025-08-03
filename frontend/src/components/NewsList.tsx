import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { News } from "../types/Dataprovider";
import NewsCard from "./NewsCard";

export interface NewsListProps {
  newsList: News[];
  isLoading: boolean;
  category?: boolean;
}

const NewsList: React.FC<NewsListProps> = ({
  newsList,
  isLoading,
  category,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const maxItems = location.pathname.includes("/all-news") || location.pathname.includes("/category")? newsList.length : 4;

  const handleReadMore = (id: string) => {
    navigate(`/news/${id}`);
  };

  return (
    <div className="mx-auto p-4">
      <h1 className="text-lg font-bold ,-3 underline">{location.pathname === "/" && "All News"}</h1>

      {isLoading ? (
        <div> Loading... </div>
      ) : newsList.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-4xl font-semibold text-gray-700">
            No news Available
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newsList.slice(0, maxItems).map((news) => (
            <NewsCard
              key={news._id}
              news={news}
              onClick={() => handleReadMore(news._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsList;
