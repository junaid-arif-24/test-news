import Category from "../model/Category";
import { Request, Response } from "express";
import User from "../model/User";
import News from "../model/News";

interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export const createCategory = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const newCategory = new Category({ name });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: "Error creating category", error });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const {id} = req.params;
  const {name} = req.body;

  try {
      const updatedCategory = await Category.findByIdAndUpdate(id, {name}, {new: true});
      res.status(200).json(updatedCategory);
  } catch (error) {
      res.status(400).json({ message: "Error updating category", error });
      
  }

}

export const subscribeCategory = async (req: AuthRequest, res: Response) => {
  const { categoryId } = req.body;

  if (!req.userId) {
    res.status(401).json({ message: "user is unautherized" });
    return;
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    if (!user.subscriptions.includes(categoryId)) {
      user.subscriptions.push(categoryId);
      await user.save();
    }

    res.status(200).json({ message: "Subscribed successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error subscribing", error });
  }
};

export const unsubscribeCategory = async (req: AuthRequest, res: Response) => {
  const { categoryId } = req.body;

  if (!req.userId) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }

  try {
    const user = await User.findById(req.userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    const index = user.subscriptions.indexOf(categoryId);
    if (index > -1) {
      user.subscriptions.splice(index, 1);
      await user.save();
    }

    res.status(200).json({ message: "Unsubscribed successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error unsubscribing", error });
  }
};

export const getSubscribedCategories = async (
  req: AuthRequest,
  res: Response
) => {
  if (!req.userId) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }
  try {
    const user = await User.findById(req.userId).populate("subscriptions");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user.subscriptions);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error fetching subscribed categories", error });
  }
};

export const getAllCategories = async (req: AuthRequest, res: Response) => {
  try {
    const { userRole } = req;
    const categories = await Category.find();

    const categoriesWithNewsCount = await Promise.all(
      categories.map(async (category) => {
        let newsCount = 0;

        if (userRole === "admin") {

          newsCount = await News.countDocuments({ category: category._id });

        } else {
            
          newsCount = await News.countDocuments({
            category: category._id,
            visibility: "public",
          });
        }

        return {
            _id: category._id,
            name: category.name,
            newsCount,
        }
      })
    );

    res.status(200).json(categoriesWithNewsCount);
  } catch (error) {

    res.status(400).json({message: "Error fetching all categories", error});
  }
};




export const deleteCategory =  async (req: Request, res: Response) => {
    const {id} = req.params;

    try {
        await Category.findByIdAndDelete(id);
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: "Error deleting category", error });
        
    }
}