import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/database";
import { Users } from "@prisma/client"; 

// Define `CustomRequest` with `Prisma.Users`
interface CustomRequest extends Request {
  user?: Users ; // Use Prisma's generated `Users` type
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

    const user = await prisma.users.findUnique({ // Use `users` model
      where: { userId: userId }, // Make sure `id` is correct based on your Users model
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    req.user = user; // Attach user data to req.user for subsequent middlewares or handlers
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: "Invalid token" });
  }
};

export {protect};
