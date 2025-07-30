import React, { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { formatDate } from "../utils/helper";
import parse from "html-react-parser";
import { News, Category } from "../types/Dataprovider";
import { deleteNews, fetchCategories, fetchNews } from "../service/api";

const ManageNews = () => {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [searchTitle, setSearchTitle] = useState<string>("");
  const [searchDescription, setSearchDescription] = useState<string>("");
  const [searchDate, setSearchDate] = useState<string>("");
  const [searchTags, setSearchTags] = useState<string>("");
  const [searchCategory, setSearchCategory] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchVisibility, setSearchVisibility] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAllCategories();
    fetchAllNews();
  }, []);

  const fetchAllCategories = async () => {
    try {
      const responseData = await fetchCategories();
      setCategories(responseData || []);
    } catch (error) {
      console.error("Error fecthing categories", error);
      toast.error("Error fetching categories");
    }
  };

  const fetchAllNews = async () => {
    try {
      setLoading(true);
      const responseData = await fetchNews({
        title: searchTitle,
        description: searchDescription,
        date: searchDate,
        tags: searchTags,
        category: searchCategory,
        visibility: searchVisibility,
      });
      setNewsList(responseData || []);
    } catch (error) {
      console.error("Error fetching news", error);
      toast.error("Error fetching news");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (news: News) => {
    navigate("/admin/create-news", { state: news });
  };

  const handleDelete = async (id: string) => {
    try {
      // const token = localStorage.getItem('token')
      await deleteNews(id);
      fetchAllNews();
      toast.success("News deleted successfully!");
    } catch (error) {
      console.error("Error in deleting News", error);
      toast.error("Error in deleting News");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Manage News</h1>

        <button
          className="bg-green-500 text-white px-4 py-2 rounded flex itme-center"
          onClick={() => navigate("/admin/create-news")}
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
          Create News
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-xl font-bold mb-2">Search News</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="title"
            value={searchTitle}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchTitle(e.target.value)
            }
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="description"
            value={searchDescription}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchDescription(e.target.value)
            }
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={searchDate}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchDate(e.target.value)
            }
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="tags (comma separated"
            value={searchTags}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchTitle(e.target.value)
            }
            className="p-2 border rounded"
          />

          <select
            value={searchCategory}
            className="p-2 border rounded"
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setSearchCategory(e.target.value)
            }
          >
            {categories.length > 0 ? (
              categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))
            ) : (
              <option value={""} disabled>
                No category Available
              </option>
            )}
          </select>

          <select
            className="p-2 border rounded"
            value={searchVisibility}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setSearchVisibility(e.target.value)
            }
          >
            <option value={""} disabled>
              Select Visibility
            </option>
            <option value={"all"}> All</option>

            <option value={"public"}>Public</option>
            <option value={"private"}>Private</option>
          </select>

          <button
            className="mt-4 bg-green-500 text-white  px-4 py-2 rounded"
            onClick={fetchAllNews}
          >
            Search
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader loading={loading} />
          </div>
        ) : newsList && newsList.length > 0 ? (
          newsList.map((news) => (
            <div
              key={news._id}
              className="bg-white flex flex-col md:flex-row gap-5 justify-between rounded shadow"
            >
              <div className="md:w-[30%] max-h-[330px]">
                <img
                  src={news.images.length > 0 ? news.images[0] : ""}
                  alt={news.title || "News Image"}
                  className="w-full h-full object-cover rounded-l-lg mb-4"
                />
              </div>
              <div  className="md:w-[70%] p-4">
                <h2 className="text-2xl font-bold">{news.title || "No Title"}</h2>
                <div >
                  {parse(news.description ? news.description.substring(0,300) : "")}
                  </div>
                  <div>

                    {news.tags && news.tags.length > 0 ? news.tags.map((tag,index)=>(
                      <span
                      key={index}
                      className="inline-block bg-blue-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                      
                      >
                        #{tag}

                      </span>
                    )):<span
                    className="inline-block bg-blue-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                    
                    > No tags</span>}
                    </div>
                    <div  className="text-blue-500 font-bold text-sm">
                      {formatDate(news.date || "")} at {news.time || "Unknown Time"} | { news.category.name  || "No category"} | {news.visibility || "Unknown"}

                      </div>

                      <div className="mt-4 flex justify-end space-x-2">
                        <button className="bg-yellow-500  text-white px-4 py-2 rounded" onClick={()=>{}}> 

                          Preview


                          </button>

                          <button className="bg-green-500 text-white px-4 py-2 rounded" 
                          onClick={()=>handleEdit(news)}
                          > 

                            Edit


                          </button>

                          <button className="bg-red-500 text-white px-4 py-2 rounded"
                          onClick={()=>handleDelete(news._id)}
                          >
                            Delete 

                          </button>

                        </div>

                </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-64 bg-white p-4 rounded shadow">
            <h2 className="text-2xl font-bold text-gray-700">
              {" "}
              No News Available
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageNews;
