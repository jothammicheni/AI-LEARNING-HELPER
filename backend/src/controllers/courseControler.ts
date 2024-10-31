import { Request, Response } from "express";
import prisma from "../config/database"; // Adjust the import path as necessary
import upload from "../utils/multerConfig"; // Adjust the import path


export const uploadCover = upload.single('coverImage'); 

const addCourses = async (req: Request, res: Response) => {
  try {
    const { title, description, tutorId } = req.body;
    const coverPath = `../views/courseCovers/${req.file?.filename}`; 

    if (!coverPath) {
      res.status(400).send('Cover image is required');
      return;
    } 

    
    const newCourse = await prisma.courses.create({
      data: {
        title,
        description,
        coverPath,
        tutorId: parseInt(tutorId, 10), 
      },
    });

    res.status(201).json({
      message: 'Course added successfully',
      course: newCourse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//get all course
const getCourses = async (req: Request, res: Response) => {
    try {
        const courses = await prisma.courses.findMany({
            include: {
                tutor:  {
                    select: {
                        name: true, 
                    }
                 }, 
                chapters: true,
                quizzes: true, 
                comments: true, 
                progress: true, 
            },
        });

        res.json(courses);
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getCourseById = async (req: Request, res: Response) => {
    const { id } = req.params; 

    try {
        const course = await prisma.courses.findUnique({
            where: { id: parseInt(id, 10) },
            include: {
                tutor: {
                    select: {
                        name: true, // Include the tutor's name
                    },
                },
            },
        });

        if (!course) {
            res.status(404).json({ error: 'Course not found' });
        }

        res.json(course);
    } catch (error) {
        console.error('Error fetching course by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



export { addCourses ,getCourses,getCourseById};
