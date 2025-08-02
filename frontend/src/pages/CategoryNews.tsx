import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NewsList from "../components/NewsList";
import { useAuth } from "../context/AuthContext";
import { Category, News } from "../types/Dataprovider";
import { fetchCategories, fetchNews } from "../service/api";
import { toast } from "react-toastify";
import CategoryList from "../components/CategoryList";

const CategoryNews = () => {
  const { cat_name } = useParams<{ cat_name: string }>();
  const [newsList, setNewsList] = useState<News[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState<boolean>(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchFilteredNews = async () => {
    setIsLoadingNews(true);
    try {
      const filters = cat_name
        ? {
            category: cat_name,
            visibility: user?.role === "admin" ? undefined : "public",
          }
        : {};
      const newsData = await fetchNews(filters);
      setNewsList(newsData);
    } catch (error) {
      toast.error("Error fetching news");
    } finally {
      setIsLoadingNews(false);
    }
  };

  const laodCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const categoryData = await fetchCategories();
      setCategories(categoryData);
    } catch (error) {
      toast.error("Error fetching categories");
    } finally {
      setIsLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchFilteredNews();
  }, [cat_name]);

  useEffect(() => {
    laodCategories();
  }, []);

  if (isLoadingCategories || isLoadingNews) {
    <div>Loading...</div>;
  }
  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full">
        <h1 className="text-lg font-bold m-3 underline ">{`${cat_name} News`}</h1>
        <NewsList
          newsList={newsList}
          isLoading={isLoadingNews}
          category={true}
        />
      </div>
      <div className="md:w-1/2 p-3">
        <h1 className="text-lg font-bold m-3 underline">Categories</h1>
        <div className="w-full p-4 space-y-4 max-h-full md:h-[calc(100vh - 50px)] overflow-y-auto">
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
  );
};

export default CategoryNews;
