import { Request, Response } from 'express';
import { activeUser } from '../utils/getLoggedInUser';
import prisma from '../config/database';


// Create a Comment
const createComment = async (req: Request, res: Response) => {
    const{courseId}=req.params
  const { comment } = req.body;

  const user = await activeUser(req, res);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  try {
    const newComment = await prisma.comments.create({
      data: {
        courseId: Number(courseId),
        comment,
        userId: user.userId,
      },
    });
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating comment' });
  }
};


const getCommentsForCourseByUser = async (req: Request, res: Response) => {
    const { courseId } = req.params;

    const user = await activeUser(req, res);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }

    try {
        const comments = await prisma.comments.findMany({
            where: {
                courseId: Number(courseId),
                userId: user.userId,
            },
            include: {
                user: true,   
                course: true,  
            }
        });

        if (comments.length === 0) {
            res.status(404).json({ message: "No comments found for this course by the user" });
            return;
        }

        res.status(200).json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: "Error fetching comments" });
    }
};

// Get a Comment by ID
const getCommentById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const comment = await prisma.comments.findUnique({
      where: { id: Number(id) },
    });
    if (!comment) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving comment' });
  }
};

// Update a Comment
const updateComment = async (req: Request, res: Response) => {
    const { courseId, id } = req.params;
    const { comment } = req.body;
  
    const user = await activeUser(req, res);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
  
    try {
      const existingComment = await prisma.comments.findFirst({
        where: {
          id: Number(id),
          courseId: Number(courseId),
          userId: user.userId,
        },
      });
  
      if (!existingComment) {
        res.status(403).json({ message: 'Unauthorized or comment not found in specified course' });
        return;
      }
  
      const updatedComment = await prisma.comments.update({
        where: { id: Number(id) },
        data: { comment },
      });
  
      res.status(200).json(updatedComment);
    } catch (error) {
      console.error("Error updating comment:", error);
      res.status(500).json({ message: 'Error updating comment' });
    }
  };

// Delete a Comment
const deleteComment = async (req: Request, res: Response) => {
    const { courseId, id } = req.params;
  
    const user = await activeUser(req, res);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
  
    try {
      const existingComment = await prisma.comments.findFirst({
        where: {
          id: Number(id),
          courseId: Number(courseId),
          userId: user.userId,
        },
      });
  
      if (!existingComment) {
        res.status(403).json({ message: 'Unauthorized or comment not found in specified course' });
        return;
      }
  
      await prisma.comments.delete({
        where: { id: Number(id) },
      });
  
      res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: 'Error deleting comment' });
    }
  };

export {
  createComment,
  getCommentById,
  updateComment,
  deleteComment,
  getCommentsForCourseByUser 
};
