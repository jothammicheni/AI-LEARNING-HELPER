// courseController.ts

import { Request, Response } from "express";
import prisma from "../config/database"; // Adjust the import path as necessary
import upload from "../utils/multerConfig"; // Adjust the import path
import fs from 'fs';
import path from 'path';

import { activeUser } from "../utils/getLoggedInUser";


export const uploadCover = upload.single('coverImage'); 

const addCourses = async (req: Request, res: Response) => {
    try {
      const { title, description } = req.body;
      //avoid courses with same title
      const existingCourse = await prisma.courses.findFirst({
        where: { title },
      });  
      if (existingCourse) {
        res.status(400).json({ message: "Course with the same title already exists" });
        return
      }
  
      // Check if file is uploaded
      if (!req.file) {      
        res.status(400).send("Cover image is required");
        return        
      }
  
      // Construct coverPath
      const coverPath = `../views/courseCovers/${title.replace(/\s+/g, "_")}/${req.file.filename}`;
  
      // Get logged-in user
      const user = await activeUser(req, res);      
      if (!user) {        
        res.status(404).json({ message: "User not found" });
        return        
      }
  
      // Create the course with the tutorId
      const newCourse = await prisma.courses.create({
        data: {
          title,
          description,
          coverPath,
          tutorId: user.userId,  // Ensure tutorId is a number
        },
      });
  
      res.status(201).json({
        message: "Course added successfully",
        course: newCourse,
      });
    } catch (error) {       
        res.status(500).json({ error: "Internal Server Error" });     
        return   
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
        return
    }
};

const getCourseById = async (req: Request, res: Response) => {   

    try {
        const { id } = req.params; 
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
            return
        }

        res.json(course);
    } catch (error) {
        console.error('Error fetching course by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        return
    }
};
const deleteCourse = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Find the course to get the coverPath
        const course = await prisma.courses.findUnique({
            where: { id: parseInt(id, 10) },
        });

        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }

        // Extract the course title from the course data
        const courseTitle = course.title.replace(/\s+/g, '_'); // Replace spaces with underscores
        const courseDirPath = path.join(__dirname, '../views/courseCovers', courseTitle); // Construct the path to the course folder

        // Delete the course from the database
        await prisma.courses.delete({
            where: { id: parseInt(id, 10) },
        });

        // Delete the course directory and its contents
        fs.rm(courseDirPath, { recursive: true, force: true }, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Failed to delete course folder' });
            }
        });

        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const updateCourse = async (req: Request, res: Response) => {
    const user = await activeUser(req, res); 
    res.send({user})
};


export { addCourses ,getCourses,getCourseById,deleteCourse,updateCourse};
