import { Request, Response, NextFunction } from "express";
import prisma from "../config/database";
import { Users } from "@prisma/client";
import { activeUser } from "../utils/getLoggedInUser";
import { verifyToken } from "../utils/utils";

// interface CustomRequest extends Request {
//   user?: Users;
// } 

const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
      const { token } = req.cookies;

      if (!token) {
          res.status(403).json({ error: "Token is required, Login first" });
          return;
      }

      const userData = verifyToken(token);
      if (!userData) {
          res.status(403).json({ message: 'Invalid token' });
          return;
      }

      const userId = userData.id as number;

      const user = await prisma.users.findUnique({
          where: { userId: userId },
      });

      if (!user) {
          res.status(404).json({ message: "User not found" });
          return;
      }

      req.user = user; // Ensure the user matches the CustomRequest type
      next();
  } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({
          error: "Invalid token"
      });
      return;
  }
};

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const user = await activeUser(req, res)
  if (!user) {
    res.status(404).json({
      message: 'User not found. Please logIn'
    })
    return
  }
  if (user.role !== 'admin') {
    res.status(403).json({
      message: 'unAuthorised Task, Admin task only'
    })
    return
  }
  next()
}
const isTutor = async (req: Request, res: Response, next: NextFunction) => {
  const user = await activeUser(req, res)
  if (!user) {
    res.status(404).json({
      message: 'User not found. Please logIn'
    })
    return
  }
  if (!(user.role == 'tutor' || user.role == 'admin')) {
    res.status(403).json({
      message: 'unAuthorised Task, Tutor/admin task only'
    })
    return
  }
  next()
}


export { protect, isAdmin, isTutor };
