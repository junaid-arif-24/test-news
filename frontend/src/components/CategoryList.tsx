import React from "react";
import { Category } from "../types/Dataprovider";

export interface CategoryListProps {
  category: Category;
  onClick: () => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ category, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-[#DDEEFF] rounded-lg cursor-pointer shadow-md flex h-14 items-center transition-transform transform hover:scale-105"
    >
      <div className="p-4 flex flex-col justify-between w-full">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold mb-1">
              {category.name || "Category"}
            </h2>
          </div>
          <p className="text-black font-bold w-10 h-10 rounded-full flex justify-center items-center bg-blue-400"> 

            {category.newsCount || 0}
          </p>

        </div>
      </div>
    </div>
  );
};

export default CategoryList;
