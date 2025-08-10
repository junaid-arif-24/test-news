import { Request, Response } from "express";
import Comment from "../model/Comment";
import mongoose from "mongoose";

interface AuthRequest  extends Request {
    userId?:string;
}

// get All Comments

export const getAllComments = async(req:AuthRequest, res:Response)=>{
    try {
        const comments =  await Comment.find().populate('user','name').populate('news','title');
        res.status(200).json(comments)
        
    } catch (error) {
        res.status(400).json({message:"Error in getting all comments",error})
    }
}

export const addComment = async(req:AuthRequest,res:Response)=>{
    const {id} = req.params;
    const {text} = req.body;

    if(!req.userId){
        res.status(401).json({message:"User is not authenticated"})
        return;
    }

    try {
        const comment =  new Comment({
            text,
            user:req.userId,
            news: new mongoose.Types.ObjectId(id),
        })
        await comment.save();
        res.status(201).json(comment)
        
    } catch (error) {
        res.status(400).json({message:"Error creating a comment "})
        
    }
}

export const deleteComment = async(req:AuthRequest, res:Response)=>{
    try {
        const {id} = req.params;
        const comment = await Comment.findByIdAndDelete(id)

        if(!comment){
            res.status(404).json({message:"Comment not found"})
            return;
        }

        res.status(200).json({message:"Comment deleted successfully"})
        
    } catch (error) {

        res.status(400).json({message:"Error deleting Comment",error})
        
    }
}