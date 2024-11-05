import { Request, Response } from "express";
import prisma from "../config/database";

// Create a new quiz
const createQuiz = async (req: Request, res: Response) => {
  const { courseId, question, answer } = req.body;

  const courseExists = await prisma.courses.findFirst({
    where: { id: courseId },
  });
  if (!courseExists) {
    res.status(404).json({
      message: "Course not found",
    });
    return 
  }

  try {
    const quiz = await prisma.quizzes.create({
      data: {
        courseId,
        question,
        answer,
      },
    });
    res.status(200).json({
      message: "Quiz added successfully",
      quiz: quiz,
    });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
    return
  }
};

// Update a quiz
const updateQuiz = async (req: Request, res: Response) => {
    const { question, answer } = req.body;
    const { quizId } = req.params;
  
    try {
      const quiz = await prisma.quizzes.update({
        where: { id: Number(quizId) }, 
        data: {
          question,
          answer,
        },
      });
      
      res.status(200).json({
        message: "Quiz updated successfully",
        quiz: quiz,
      });
    } catch (error) {
      res.status(500).json({
        message: error 
      });
      return
    }
  };

// Delete a quiz
const deleteQuiz = async (req: Request, res: Response) => {
  const { quizId } = req.params;

  try {
    await prisma.quizzes.delete({
      where: { id: Number(quizId) },
    });
    res.status(200).json({
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error
    });

    return
  }
};

// Get all quizzes for a specific course
const getAllQuizzesForCourse = async (req: Request, res: Response) => {
  const { courseId } = req.params;

  try {
    const quizzes = await prisma.quizzes.findMany({
      where: { courseId: Number(courseId) },
    });
    res.status(200).json({
      message: `Quizzes for course ${courseId}`,
      quizzes: quizzes,
    });
  } catch (error) {
    res.status(500).json({
      message: error
    });

    return
  }
};

export { createQuiz, updateQuiz, deleteQuiz, getAllQuizzesForCourse };
