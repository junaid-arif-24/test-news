import {Request , Response, NextFunction } from "express";

interface RoleRequest extends Request {
    userId?: string;
    userRole?: string;
}


const checkRole = (roles:string[]) => {

    return (req: RoleRequest, res: Response, next: NextFunction) => {
        if(!req.userId ||!roles.includes(req.userRole)){
            res.status(403).json({message : "Access Denied"});
            return;
        }
        next();

    }

}

export default checkRole;