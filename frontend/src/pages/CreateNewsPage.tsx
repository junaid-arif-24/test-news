import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Category, News } from "../types/Dataprovider";
import { fetchCategories } from "../service/api";
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";

interface errorFields {
  title: boolean;
  description: boolean;
  images: boolean;
  category: boolean;
}
const CreateNewsPage = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [visibility, setVisibilty] = useState<string>("public");
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorFields, setErrorFields] = useState<errorFields>({
    title: false,
    description: false,
    images: false,
    category: false,
  });

  const titleRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLInputElement>(null);
  const quillRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const newsToEdit = location.state as News | null;

  useEffect(() => {
    fetchCategoriesData();
    if (newsToEdit) {
      setTitle(newsToEdit.title);
      setDescription(newsToEdit.description);
      setTags([...newsToEdit.tags]);
      setCategory(newsToEdit.category._id);
      setVisibilty(newsToEdit.visibility);
      setIsEdit(true);
    }
  }, [newsToEdit]);

  const fetchCategoriesData = async () => {
    try {
      const categories = await fetchCategories();
      setCategories(categories);
    } catch (error) {
      console.error("Error fetching the categories", error);
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages((prevImages) => prevImages.concat(filesArray));
    }
  };

  const removeImage = (image: File) => {
    setImages(images.filter((img) => img !== image));
  };

  const handleRemoveExistingImage = (imageUrl: string) => {
    setExistingImages(existingImages.filter((img) => img !== imageUrl));
    setRemovedImages((prev) => [...prev, imageUrl]);
  };

  const handleTagInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        {isEdit ? "Edit News" : "Create News"}
      </h1>
      <form className="bg-white p-6 rounded-lg shadow-lg" onSubmit={() => {}}>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="title">
            Title
          </label>
          <input
            ref={titleRef}
            type="text"
            placeholder="title"
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setTitle(e.target.value);
              setErrorFields((prev) => ({ ...prev, title: false }));
            }}
            className={`shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                    ${errorFields.title ? "border-red-500" : ""}
                    `}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="description">
            {" "}
            Description
          </label>
          <div
            ref={quillRef}
            className={`${errorFields.description ? "bg-red-200" : ""}`}
          >
            <ReactQuill
              theme="snow"
              value={description}
              onChange={(value) => {
                setDescription(value);
                setErrorFields((prev) => ({ ...prev, description: false }));
              }}
              className={`${errorFields.description ? "" : "bg-white"}`}
            />
          </div>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="images"
          >
            Images
          </label>
          <input
            ref={imageInputRef}
            className={`shadow appearance-none border rounded w-full px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                ${errorFields.images ? "border-red-500" : ""}`}
            type="file"
            multiple
            onChange={handleImageUpload}
          />

          <div className="mt-2 flex flex-wrap">
            {existingImages.map((image, index) => (
              <div key={index} className="relative m-1">
                <img
                  src={image}
                  alt={`upload-${index}`}
                  className="w-20 h-20 object-cover rounded"
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                  onClick={()=>handleRemoveExistingImage(image)}
                ></button>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateNewsPage;
