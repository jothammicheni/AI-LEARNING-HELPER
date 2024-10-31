import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/database";


interface CustomRequest extends Request {
  user?: { userId: number }; 
}

const protect = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
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
  console.log("TOKEN_SECRET:", tokenSecret);

  try {
    const verified = jwt.verify(token, tokenSecret) as jwt.JwtPayload;   
    const userId = verified.id as number;
    const user = await prisma.users.findUnique({
      where: { userId },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return; 
    }  

    req.user = user; 
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

export { protect };
