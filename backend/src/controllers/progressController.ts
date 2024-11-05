import { Request, Response } from "express";
import prisma from "../config/database";
import { activeUser } from "../utils/getLoggedInUser";

const CreateProgress = async (req: Request, res: Response) => {
   try {
       const { courseId } = req.params;

       // Check if the course exists
       const courseExists = await prisma.courses.findUnique({
           where: { id: Number(courseId) },
       });

       if (!courseExists) {
           res.status(404).json({ message: `Course with id ${courseId} not found` });
           return;
       }

       // Get all chapters in the course
       const allChapters = await prisma.chapters.findMany({
           where: { courseId: Number(courseId) },
       });

       if (allChapters.length === 0) {
           res.status(404).json({ message: "No chapters found for this course" });
           return;
       }

       // Calculate completed chapters
       const completedChapters = await prisma.chapters.count({
           where: {
               courseId: Number(courseId),
               isCompleted: true, // Assuming there's an `isCompleted` field in `Chapters` model
           },
       });

       // Calculate progress percentage
       const progressPercentage = (completedChapters / allChapters.length) * 100;


       const user = await activeUser(req, res);
       if (!user) {
           res.status(404).json({ message: "User not found" });
           return;        
       }

       // Delete any existing progress records associated with this courseId for the user
       await prisma.progress.deleteMany({
           where: {
               courseId: Number(courseId),
               usersUserId: user.userId, // Ensure this targets the correct user's progress
           },
       });

       // Create a new progress record for the user
       const progress = await prisma.progress.create({
           data: {
               courseId: Number(courseId),
               progressPercentage: progressPercentage,
               lastAccessed: new Date(),
               usersUserId: user.userId || null, // Adjust based on actual data structure
               chaptersId: req.body.chaptersId || null,
           },
       });

       res.status(201).json({ message: "Progress created successfully", progress });
   } catch (error) {
       console.error("Error creating progress:", error);
       res.status(500).json({ error: "Internal Server Error" });
   }
};


export {CreateProgress};
