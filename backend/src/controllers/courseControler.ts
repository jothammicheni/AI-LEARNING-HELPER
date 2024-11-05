// courseController.ts

import { NextFunction, Request, Response } from "express";
import prisma from "../config/database"; 
import {upload,updateCourseCover } from "../utils/multerConfig"; 
import fs from 'fs';
import path from 'path';
import { activeUser } from "../utils/getLoggedInUser";
import { validateCourseInput } from "../middleware/validators";

const uploadCover = upload.single('coverImage'); 
const updateCover = updateCourseCover.single('coverImage'); 
const addCourses = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const { title, description } = req.body;
        if (!req.file) {
            res.status(400).send("Cover image is required");
            return;        
        }
        const coverPath = path.join('/courseCovers', title.replace(/\s+/g, "_"), req.file.filename);
       
        //validate the body inputs
      const validationError= validateCourseInput(title,description,coverPath)
      if(validationError) {
        res.status(400).json({message:validationError})
        return
      }

        const existingCourse = await prisma.courses.findFirst({
            where: { title },
        });
        if (existingCourse) {
            res.status(400).json({ message: "Course with the same title already exists" });
            return;
        }

        // Get logged-in user
        const user = await activeUser(req, res);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;        
        }

        const newCourse = await prisma.courses.create({
            data: {
                title,
                description,
                coverPath,
                tutorId: user.userId,  
            },
        });

        res.status(201).json({
            message: "Course added successfully",
            course: newCourse,
        });
    } catch (error) {
        console.error("Error adding course:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};  

// Get all courses
const getCourses = async (req: Request, res: Response) => {
    try {
        const courses = await prisma.courses.findMany({
            include: {
                tutor: {
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

// Get course by ID
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
            return;
        }

        res.json(course);
    } catch (error) {
        console.error('Error fetching course by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete a course
const deleteCourse = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const course = await prisma.courses.findUnique({
            where: { id: parseInt(id, 10) },
        });

        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }

        const courseTitle = course.title.replace(/\s+/g, '_'); 
        const courseDirPath = path.join(__dirname, '../views/courseCovers', courseTitle); 

        await prisma.courses.delete({
            where: { id: parseInt(id, 10) },
        });

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
    const { courseId } = req.params; 
    const {
        title,
        description,
        coverPath,
        tutorId,
    } = req.body; 

    console.log('Request Body:', req.body); 
    console.log('Course ID:', courseId); 

    try {
        const existingCourse = await prisma.courses.findUnique({
            where: { id: Number(courseId) },
        });

        if (!existingCourse) {
           res.status(404).json({ message: 'Course not found' });
           return 
        }

        console.log('Existing Course:', existingCourse); 

        if (!req.file) {
            res.status(400).send("Cover image is required");
            return;        
        }
        const coverPath = path.join('/courseCovers', title.replace(/\s+/g, "_"), req.file.filename);
        const updateData: any = {};

        if (title && title !== existingCourse.title) {
            updateData.title = title;
        }
        if (description && description !== existingCourse.description) {
            updateData.description = description;
        }
        if (coverPath && coverPath !== existingCourse.coverPath) {
            updateData.coverPath = coverPath;
        }
        if (tutorId && tutorId !== existingCourse.tutorId) {
            updateData.tutorId = tutorId;
        }

        if (Object.keys(updateData).length === 0) {
            res.status(400).json({ message: 'No fields to update' });
            return
        }

        console.log('Update Data:', updateData); 

        const updatedCourse = await prisma.courses.update({
            where: { id: Number(courseId) },
            data: updateData,
        });

        res.status(200).json(updatedCourse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error'});
        return 
    }
};

export { addCourses,
     getCourses,
      getCourseById,
       deleteCourse, 
       updateCourse,
       uploadCover,
    updateCover };
