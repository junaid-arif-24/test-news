import { News } from "../types/Dataprovider";
import CategoryIcon from "@mui/icons-material/Category";
import { calculateReadingTime, formatDate, formatTime } from "../utils/helper";
import parse from "html-react-parser";

export interface NewsCardProps {
  news: News;
  onClick: () => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white cursor-pointer rounded-md shadow-md flex flex-col gap-1 transition-transform transform hover:scale-105"
    >
      <img
        src={news.images[0] || "/default-image.jpg"}
        alt={news.title || "new image"}
        className="w-full h-40 object-cover mb-1"
      />
      <div className="p-2 pt-0">
        <div className="flex justify-between text-sm text-right">
          <p className="text-orange-600 font-bold">
            <CategoryIcon sx={{ fontSize: 16 }} />
            {news.category?.name || "No category"}
            <span className="text-gray-600 ml-1">
              &bull; {calculateReadingTime(news.description || "")} min read
            </span>
          </p>
          <p className="font-bold text-blue-600">
            &bull; {formatDate(news.date || "")} at{" "}
            {formatTime(news.time || "")}
          </p>
        </div>
        <h3 className="text-lg font-semibold mb-2">{news.title || "No Title" }</h3>
        <div className="text-gray-600 text-sm mb-2">
            {parse(news.description?.substring(0,100) || "No Description available...")}....
        </div>
      </div>
    </div>
  );
};


export default NewsCard;
