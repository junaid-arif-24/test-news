import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { Category } from "../types/Dataprovider";
import {
  fetchCategories,
  fetchSubcribedCategories,
  subscribeCategory,
  unSubscribeCategory,
} from "../service/api";

const CategoryPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subscribedCategories, setSubscribedCategories] = useState<string[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await handleFetchCategories();
      await handleFetchSubscribedCategories();
      setLoading(false);
    };
    fetchData();
  }, [isAuthenticated, user]);

  const handleFetchCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const handleFetchSubscribedCategories = async () => {
    try {
      if (!isAuthenticated) return;
      const data = await fetchSubcribedCategories();
      const subscribedCatIds = data.map((category: Category) => category._id);
      setSubscribedCategories(subscribedCatIds);
    } catch (error) {
      console.error("Error fetching subscribed categories", error);
    }
  };

  const handleSubscribe = async (categoryId: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to subscribe");
      navigate("/login");
      return;
    }

    try {
      await subscribeCategory(categoryId);
      setSubscribedCategories((prev) => [...prev, categoryId]);
      toast.success("Subscribed successfully");
    } catch (error) {
      toast.error("Error subscribing");
    }
  };

  const handleUnsubscribe = async (categoryId: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to unsubscribe");
      navigate("/login");
      return;
    }
    try {
      await unSubscribeCategory(categoryId);
      setSubscribedCategories((prev) => prev.filter((id) => id !== categoryId));
      toast.success("Unsubscribed successfully");
    } catch (error) {
      toast.error("Error unsubscribing");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader loading={loading} />
      </div>
    );
  }

  return (
    <div className="container  mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      {categories.length === 0 ? (
        <div className="flex justify-center items-center h-24">
          <p className="text-gray-700">No categories found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            // const isSubscribed = subscribedCategories.includes(category._id);
            return (
              <div
                key={category._id}
                className="bg-white rounded-lg shadow-md flex h-24 transition transform hover:scale-105 cursor-pointer "
              
              >
                <div className="p-4 flex flex-col justify-between w-full">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold mb-1">{category.name}</h2>
                    <div className="flex items-center">
                      <p className="text-black font-bold w-10 h-10 rounded-full flex justify-center items-center bg-blue-500">
                        {category.newsCount || 0}
                      </p>
                    </div>
                  </div>
                  {
                    user?.role === "subscriber" && (
                      <div className="flex justify-between mt-0">
                        {
                          subscribedCategories.includes(category._id)?(
                            <button
                            onClick={(e)=>{
                              e.stopPropagation();
                              handleUnsubscribe(category._id)
                            }}
                             className="bg-gray-500 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-2 rounded">
                                Unsubcribe 
                            </button>
                          ):
                          (
                            <button onClick={(e)=>{
                              e.stopPropagation();
                              handleSubscribe(category._id)
                            }} className="bg-red-500 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-2 rounded">
                              Subscribe
                            </button>
                          )
                        }


                      </div>
                    )
                  }
                
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
