import { Request, RequestHandler, Response } from "express";
import User from "../model/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendLoginWelcomeEmail, sendRegistrationWelcomeEmail } from "../utils/mailer";
import dotenv from "dotenv";

dotenv.config();



interface RegisterRequest extends Request {
  body: {
    name: string;
    email: string;
    password: string;
    role: string;
  };
}

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
  userId?: string | undefined;
}


export const register = async (req: RegisterRequest, res: Response) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      res.status(400).json({
        message: "User already exists",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    const token = jwt.sign(
      {
        email: user.email,
        id: user._id,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "12h",
      }
    );
    await sendRegistrationWelcomeEmail(email, name)

    res.status(201).json({ result: user, token });

    return;
  } catch (error) {
    console.log("Error registering user:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};



export const login = async (req: LoginRequest, res: Response) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({
      email,
    });

    if (!existingUser) {
      res.status(404).json({
        message: "User does not exist",
      });

      return;
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      res.status(400).json({
        message: "Invalid credentials",
      });

      return;
    }
    req.userId = existingUser._id as string;
    const token = jwt.sign(
      {
        email: existingUser.email,
        id: existingUser._id,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "12h",
      }
    );
  

    res.status(200).json({ result: existingUser, token });

    await sendLoginWelcomeEmail(email, existingUser.name)
    return;
  } catch (error) {
    console.log("Error logging in user:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getCurrentUser = async (req:Request, res: Response) =>{
const userId = (req as any).userId;

const user = await User.findById(userId).select("-password");

if(!user){
   res.status(404).json({message: "User not found"})
   return;
}

res.status(200).json(user);

}

export const logout = (req:Request, res: Response) =>{
  res.status(200).json({message:"user is logged out"});
  return;
}
