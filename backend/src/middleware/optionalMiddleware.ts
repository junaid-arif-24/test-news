import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../model/User";
import dotenv from 'dotenv';

dotenv.config();

interface AuthRequest extends Request {
    userId? : string;
    userRole?: string;
}

const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {

    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            next();
            return;
        }

        const decodedToken = jwt.verify(token, process.env.SECRET_KEY as string) as { id: string };
        req.userId = decodedToken.id;

        const user = await User.findById(req.userId);

        if(user){
            req.userRole  = user.role;
        }

        next();
        
    } catch (error) {
        
        return next();
    }
}


export default optionalAuth;