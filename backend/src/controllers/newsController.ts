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

export const getAllNews = async (req: Request, res: Response) => {
  try {
    const news = await News.find().populate("category", "name");
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
    ).populate("category", "name").exec();
    if (!news) {
       res.status(401).json({ message: "News Not Found" });
       return
    }

     res.status(200).json(news);
  } catch (error) {
    res.status(400).json({ mesaage: "Error in Fetching News" });
  }
};

export const updateNews = async (req:Request, res:Response)=>{
    const {id } = req.params;
    const {title, description,category,tags,visibility,youtubeUrl,removedImages} = req.body;
    const files = req.files as Express.Multer.File[];

    try {
        const newsToUpdate = await News.findById(id);
        if(!newsToUpdate){
             res.status(404).json({message: "News not found"})
             return;

        }
        // Handle Image Removal

        if(removedImages && removedImages.length > 0){
            let removedImagesArray = Array.isArray(removedImages)? removedImages : JSON.parse(removedImages);

            for( const imageUrl of removedImagesArray){
                const regex = /\/news_images\/([^\/]+)\.[a-zA-Z]+$/;
                const match = imageUrl.match(regex);
                if(match && match[1]){
                    const publicId = match[1]
                    await cloudinary.uploader.destroy(`new_images_folder/${publicId}`)
                }
            }

            newsToUpdate.images = newsToUpdate.images.filter((img)=>!removedImagesArray.includes(img))
        }

        if (files && files.length >0 ){
            const uploadPromises = files.map((file)=>
            cloudinary.uploader.upload(file.path,{
                folder:"new_images_folder",
                format: "jpeg"
            })
            )
            const uploadResults = await Promise.all(uploadPromises);
            const imageUrls =  uploadResults.map((result)=>result.secure_url)

            newsToUpdate.images = [...newsToUpdate.images, ...imageUrls];

           
        }
         //update the news fields

         newsToUpdate.title = title ||  newsToUpdate.title;
         newsToUpdate.description =  description || newsToUpdate.description;
         newsToUpdate.category =  category || newsToUpdate.category;
         newsToUpdate.tags = tags ? tags.split(","): null;
         newsToUpdate.visibility = visibility || newsToUpdate.visibility;
         newsToUpdate.youtubeUrl =  youtubeUrl || newsToUpdate.youtubeUrl;

         const updatedNews = await newsToUpdate.save();
         res.status(200).json(updatedNews);

        
    } catch (error) {
        console.error("Error in Updating News", error)
        res.status(400).json({message: "Error Updating News"})
        
    }
}

export const deleteNews = async (req:Request, res:Response) =>{
const {id } = req.params;

try{
    await News.findByIdAndDelete(id);
    res.status(200).json({message  : "News Deleted"})

} catch (error){
    console.error("Error in Deleting News", error)
    res.status(400).json({message  : "Error in Deleting News"})
}

}