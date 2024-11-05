import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/database";
import { Users } from "@prisma/client"; 
import { activeUser } from "../utils/getLoggedInUser";

interface CustomRequest extends Request {
  user?: Users ; 
}

const protect = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
  const token = req.cookies.token;

  if (!token) {
    res.status(403).json({ error: "Token is required" });
    return;
  }

  const tokenSecret = process.env.TOKEN_SECRET;
  if (!tokenSecret) {
    res.status(500).json({ error: "Token secret is not defined" });
    return;
  }

 
    const verified = jwt.verify(token, tokenSecret) as jwt.JwtPayload;
    console.log('Verified token:', verified);

    const userId = verified.id as number;

    const user = await prisma.users.findUnique({ 
      where: { userId: userId },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    
    req.user = user; 
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: "Invalid token" });
  }
};

const isAdmin= async(req:Request,res:Response,next:NextFunction) => {
 const user=   await activeUser(req,res) 
   if(!user){
    res.status(404).json({
       message:'User not found. Please logIn'       
      })
      return     
   }
   if(user.role!=='admin'){
     res.status(403).json({
        message:'unAuthorised Task, Admin task only'
     })
     return
   }
   next()
}
const isTutor= async(req:Request,res:Response,next:NextFunction) => {
  const user=   await activeUser(req,res) 
    if(!user){
     res.status(404).json({
        message:'User not found. Please logIn'       
       })
       return     
    }
    if(!(user.role=='tutor'||user.role=='admin')){
      res.status(403).json({
         message:'unAuthorised Task, Tutor/admin task only'
      })
      return
    }
    next()
 }


export {protect,isAdmin,isTutor};
