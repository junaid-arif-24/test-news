import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import News from "../model/News";
import User from "../model/User";
import Category from "../model/Category";
import mongoose from "mongoose";
import Comment from "../model/Comment";

interface AuthRequest extends Request {
  userId?: string;
}

// Create News

export const createNews = async (req: Request, res: Response) => {
  const { title, description, category, tags, visibility, youtubeUrl } =
    req.body;
  const files = req.files as Express.Multer.File[];
  if (!files) {
    res.status(400).json({ message: "No files were uploaded" });
    return;
  }

  try {
    const uploadPromises = files.map((file) =>
      cloudinary.uploader.upload(file.path, {
        folder: "news_images_folder",
        format: "jpeg",
      })
    );

    const uploadResults = await Promise.all(uploadPromises);
    const imageUrls = uploadResults.map((result) => result.secure_url);

    const currentDate = new Date();
    const date = currentDate.toISOString().slice(0, 10);
    const time = currentDate.toLocaleTimeString();

    const newNews = new News({
      title,
      description,
      images: imageUrls,
      date,
      time,
      category,
      tags: tags.split(","),
      visibility,
      youtubeUrl,
    });

    await newNews.save();
    res.status(201).json(newNews);
  } catch (error) {
    res.status(400).json({ message: "error in creating News" });
  }
};

export const getTrendingNews = async (req: Request, res: Response) => {
  try {
    const trendingNews = await News.find({
      visibility: "public",
      views: { $gt: 10 },
    })
      .populate("category", "name")
      .sort({ views: -1 })
      .limit(5);
      res.status(200).json(trendingNews);
  } catch (error) {

    res.status(400).json({message: "Error in fetching trending news",error});
  }
};

export const getLatestNews = async (req:Request, res: Response)=>{
  try {
    const latestNews = await News.find().sort({date:-1}).limit(10);
    res.status(200).json(latestNews)
    
  } catch (error) {
    res.status(400).json({message:"Error in fetching Latest News", error})
    
  }
}

export const getRelatedNews = async (req:Request, res:Response)=>{
  const {id} = req.params;
  try {
    const currentNews = await News.findById(id).populate("category");
    if(!currentNews){
      res.status(404).json({message:"News not found"})
      return;
    }
    const relatedNews = await News.find({
      _id :{$ne:id},
      category:currentNews.category,
      tags:{$in:currentNews.tags}
    }).limit(4);

    res.status(200).json(relatedNews);
    
  } catch (error) {
    console.log("Error in fetching related News",error)
    res.status(400).json({message:"Error fetching related News",error})
    
  }
}

export const getAllNews = async (req: Request, res: Response) => {
  const { title, description, date, tags, category, visibility } = req.query;
  const query: any = {};

  if (title) query.title = { $regex: title, $options: "i" };
  if (description) query.description = { $regex: description, $options: "i" };
  if (date) query.date = new Date(date as string);
  if (typeof tags === "string" && tags !== "")
    query.tags = { $in: tags.split(",") };
  if (category) {
    const categoryDoc = await Category.findOne({ name: category });
    if (categoryDoc) {
      query.category = categoryDoc._id;
    } else {
      res.status(400).json({ message: " category not found" });
      return;
    }
  }
  if (typeof visibility === "string") {
    if (visibility !== "all") {
      query.visibility = visibility;
    }
  }

  try {
    const news = await News.find(query).populate("category", "name");
    res.status(200).json(news);
  } catch (error) {
    res.status(400).json({ message: "Error fetching News", error });
  }
};

export const getNewsById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const news = await News.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate("category", "name")
      .exec();
    if (!news) {
      res.status(401).json({ message: "News Not Found" });
      return;
    }
    const comments = await Comment.find({news:id}).populate("user","name email");

    const newsWithComments =  {
      ...news.toObject(),
      comments:comments,
    }

    res.status(200).json(newsWithComments);
  } catch (error) {
    res.status(400).json({ mesaage: "Error in Fetching News" });
  }
};

export const updateNews = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    title,
    description,
    category,
    tags,
    visibility,
    youtubeUrl,
    removedImages,
  } = req.body;
  const files = req.files as Express.Multer.File[];

  try {
    const newsToUpdate = await News.findById(id);
    if (!newsToUpdate) {
      res.status(404).json({ message: "News not found" });
      return;
    }
    // Handle Image Removal

    if (removedImages && removedImages.length > 0) {
      let removedImagesArray = Array.isArray(removedImages)
        ? removedImages
        : JSON.parse(removedImages);

      for (const imageUrl of removedImagesArray) {
        const regex = /\/news_images\/([^\/]+)\.[a-zA-Z]+$/;
        const match = imageUrl.match(regex);
        if (match && match[1]) {
          const publicId = match[1];
          await cloudinary.uploader.destroy(`new_images_folder/${publicId}`);
        }
      }

      newsToUpdate.images = newsToUpdate.images.filter(
        (img) => !removedImagesArray.includes(img)
      );
    }

    if (files && files.length > 0) {
      const uploadPromises = files.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: "new_images_folder",
          format: "jpeg",
        })
      );
      const uploadResults = await Promise.all(uploadPromises);
      const imageUrls = uploadResults.map((result) => result.secure_url);

      newsToUpdate.images = [...newsToUpdate.images, ...imageUrls];
    }
    //update the news fields

    newsToUpdate.title = title || newsToUpdate.title;
    newsToUpdate.description = description || newsToUpdate.description;
    newsToUpdate.category = category || newsToUpdate.category;
    newsToUpdate.tags = tags ? tags.split(",") : null;
    newsToUpdate.visibility = visibility || newsToUpdate.visibility;
    newsToUpdate.youtubeUrl = youtubeUrl || newsToUpdate.youtubeUrl;

    const updatedNews = await newsToUpdate.save();
    res.status(200).json(updatedNews);
  } catch (error) {
    console.error("Error in Updating News", error);
    res.status(400).json({ message: "Error Updating News" });
  }
};

export const deleteNews = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await News.findByIdAndDelete(id);
    res.status(200).json({ message: "News Deleted" });
  } catch (error) {
    console.error("Error in Deleting News", error);
    res.status(400).json({ message: "Error in Deleting News" });
  }
};

export const saveNews = async(req:AuthRequest, res:Response)=>{
  const {id} = req.params;
  if(!req.userId){
     res.status(401).json({message:"User Not Authentication"})
    return;
  }

  try {
    const user = await User.findById(req.userId);

    if(!user){
      res.status(404).json({message:"user not found"})
    }
      const newsId : any = new mongoose.Types.ObjectId(id);
    if (!user.savedNews.includes(newsId)) {
      user.savedNews.push(newsId);
      await user.save();
    }
    res.status(201).json({message:"News Saved", savedNews: user.savedNews})

  } catch (error) {

    res.status(400).json({message:"Error saving news",error})
    
  }
}

export const unsaveNews = async(req:AuthRequest,res:Response)=>{
  const {id} =  req.params;

  if(!req.userId){
    res.status(401).json({message:"user is not authenticated"})
    return;
  }

  try {
    const user = await User.findById(req.userId)

    if(!user){
      res.status(404).json({message:"User not found"})
      return;
    }
    const newsId : any = new mongoose.Types.ObjectId(id);

    if(user.savedNews.includes(newsId)){
      user.savedNews = user.savedNews.filter(
        (savedNewsId)=> newsId ==! savedNewsId 
      )
      await user.save();
    }

    res.status(200).json({message:"News unsaved", saveNews:user.savedNews})
    
  } catch (error) {
    res.status(400).json({message:"error unsaving news", error})
  }
}


export const getSavedNews =  async(req:AuthRequest, res:Response)=>{
  if(!req.userId){
    res.status(401).json({message:"user is not authenticated"})
    return;
  }

  try {
    const user = await User.findById(req.userId)
    if(!user){
      res.status(404).json({message:"User not found"})
      return;
    }
    const savedNews =  user.savedNews;
    res.status(200).json(savedNews)


    
  } catch (error) {
    res.status(400).json({message:"Error fetching saved news",error})
    
  }
}
