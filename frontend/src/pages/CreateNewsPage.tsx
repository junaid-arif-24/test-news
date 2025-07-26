import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Category, News } from "../types/Dataprovider";
import { createOrUpdateNews, fetchCategories } from "../service/api";
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/Loader";

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
  const [youtubeUrl, setYoutubeUrl] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [visibility, setVisibilty] = useState<"public"|"private">("public");
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
  const categoryRef = useRef<HTMLSelectElement>(null);
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
      setVisibilty(newsToEdit.visibility as "public" | "private");
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
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const validateForm = () => {
    // Define individual error flags
    const hasTitleError = !title;
    const hasDescriptionError = !description;
    const hasImagesError = images.length === 0 && existingImages.length === 0;
    const hasCategoryError = !category;
  
    // Set errors based on priority
    if (hasTitleError) {
      setErrorFields({
        title: true,
        description: false,
        images: false,
        category: false,
      });
      titleRef.current?.focus();
      toast.error("Please enter a title");
      return false;
    } else if (hasDescriptionError) {
      setErrorFields({
        title: false,
        description: true,
        images: false,
        category: false,
      });
      quillRef.current?.focus();
      toast.error("Please enter a description");
      return false;
    } else if (hasImagesError) {
      setErrorFields({
        title: false,
        description: false,
        images: true,
        category: false,
      });
      imageInputRef.current?.focus();
      toast.error("Please upload at least one image");
      return false;
    } else if (hasCategoryError) {
      setErrorFields({
        title: false,
        description: false,
        images: false,
        category: true,
      });
      categoryRef.current?.focus();
      toast.error("Please select a category");
      return false;
    }
  
    // No errors
    setErrorFields({
      title: false,
      description: false,
      images: false,
      category: false,
    });
    return true;
  };

  const handleSubmit = async(e: FormEvent)=>{
    e.preventDefault();
    setLoading(true)
    if(!validateForm()){
      setLoading(false)
      return;
    }

    const formData = new FormData();
    formData.append("title",title)
    formData.append("description",description)
    images.forEach((image)=> formData.append("images",image));
    formData.append("removedImages",JSON.stringify(removedImages))
    formData.append("tags",tags.join(","))
    formData.append("category",category)
    formData.append("visibility",visibility)
    formData.append("youtubeUrl",youtubeUrl)

    try {

      await createOrUpdateNews(formData,isEdit, newsToEdit?._id)
      toast.success(isEdit ? "Update successfully":"create  successfully")

      setTitle("")
      setCategory("")
      setDescription("")
      setImages([])
      setTags([])
      setVisibilty("public")
      setYoutubeUrl("")
      navigate("/admin/manage-news")
      
    } catch (error) {

      console.error("Error in creating or updating news",error)
      toast.error("Error in creating or updating news")
    }
    finally{
      setLoading(false)
    }
  }
  

  return (
    <div className="container mx-auto p-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <h1 className="text-3xl font-bold mb-4">
        {isEdit ? "Edit News" : "Create News"}
      </h1>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader loading={loading} />
          </div>
      ): (
        <form className="bg-white p-6 rounded-lg shadow-lg" onSubmit={handleSubmit}>
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
                  onClick={() => handleRemoveExistingImage(image)}
                >
                  &times;
                </button>
              </div>
            ))}
            {images.map((image, index) => (
              <div key={index} className="relative m-1">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`upload-${index}`}
                  className="w-20 h-20 object-cover rounded"
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                  onClick={() => removeImage(image)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="tags"
          >
            Tags
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Add tags and press enter or qoma ,"
            value={tagInput}
            onChange={handleTagInputChange}
            onKeyDown={handleTagKeyDown}
          />
          <div className="mt-2 flex flex-wrap">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
              >
                {tag}
                <button
                  type="button"
                  className="ml-1 text-red-600"
                  onClick={() => removeTag(tag)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="youtubeUrl"
          >
            Yuotube URL
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Youtube video url"
            value={youtubeUrl === "undefined" ? "" : youtubeUrl}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setYoutubeUrl(e.target.value)
            }
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2 "
            htmlFor="category"
          >
            Category
          </label>
          <select
            ref={categoryRef}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none fpocus:shadow-outline
            ${errorFields.category ? "border-red-500" : ""}`}
            value={category}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setCategory(e.target.value);
              setErrorFields((prev) => ({ ...prev, category: false }));
            }}
          >
            <option value={""}> Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold text-sm" htmlFor="visibility">Visibility</label>
          <select
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={visibility}
          onChange={(e:ChangeEvent<HTMLSelectElement >)=>{
            setVisibilty(e.target.value as "public" | "private")
          }}
          >
            <option value={"public"}>Public</option>
            <option value={"private"}>Private</option>


          </select>

        </div>

        <button
        type="submit"
        className="bg-green-500 hover:bg-blue-700 cursor-pointer text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
            {newsToEdit ? "Update News" : "Create News"}

        </button>
      </form>
      )}
    
    </div>
  );
};

export default CreateNewsPage;
