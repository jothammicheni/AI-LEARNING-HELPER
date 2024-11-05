import multer from 'multer';
import { Request, Response } from "express";
import path from 'path';
import fs from 'fs';
import prisma from '../config/database';

// Define storage for the cover images
const courseCoverStorage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    const courseTitle = req.body.title.replace(/\s+/g, '_'); // Replace spaces with underscores for folder names
    const dir = path.join(__dirname, '../views/courseCovers',courseTitle);

    // Create the course title directory if it doesn't exist
    fs.mkdirSync(dir, { recursive: true });

    cb(null, dir); // Set the upload path to the course title directory
  },
  filename: (req: Request, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Store with a unique name
  }
});

const updateCoursecover = multer.diskStorage({ 
  
      destination: (req, file, cb) => {
          const courseTitle = req.body.title.replace(/\s+/g, '_'); // Replace spaces with underscores for folder names
          const dir = path.join(__dirname, '../views/courseCovers', courseTitle);

          // Delete existing files in the course title directory if it exists
          if (fs.existsSync(dir)) {
              fs.readdirSync(dir).forEach(file => {
                  const filePath = path.join(dir, file);
                  fs.unlinkSync(filePath); // Delete each file in the directory
              });
          } else {
              // Create the course title directory if it doesn't exist
              fs.mkdirSync(dir, { recursive: true });
          }

          cb(null, dir); // Set the upload path to the course title directory
      },
      filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, uniqueSuffix + path.extname(file.originalname)); // Store with a unique name
      }
  })




// Define storage for chapter files
const chapterFilesStorage = multer.diskStorage({
  destination: async (req: Request, file, cb) => {
    try {
      const { courseId} = req.body;

      // Ensure courseId is provided
      if (!courseId) {
        return new Error('Course ID is required')
      }

       // Convert courseId to an integer
       const parsedCourseId = parseInt(courseId, 10);
       if (isNaN(parsedCourseId)) {
         new Error('Invalid Course ID')
       }
 
       // Fetch the course from the database using the correct format
       const course = await prisma.courses.findFirst({
         where: {
           id: parsedCourseId // Use the parsed integer value
         }
       });

      if (!course) {
        console.log('Course not found');
        return new Error('Course not found')
      }

      const courseTitle = course.title.replace(/\s+/g, '_'); // Replace spaces with underscores for folder names
      const dir = path.join(__dirname, '../views/chapterFiles', courseTitle); // Set the upload path

      // Create the course title directory if it doesn't exist
      fs.mkdirSync(dir, { recursive: true });

      cb(null, dir); // Set the upload path to the course title directory
    } catch (error) {
      console.error('Error in destination callback:', error);
      return
    }
  },
  filename: (req: Request, file, cb) => {
    const { title } = req.body;
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(`${title.replace(/\s+/g, "_")}_${file.originalname}`)); // Store with a unique name
  }
});


// Initialize multer for course covers
const upload = multer({ storage: courseCoverStorage });
// Initialize multer for chapter files
const uploadChapter = multer({ storage: chapterFilesStorage }).single('contentPath');

const updateCourseCover = multer({ storage: updateCoursecover });

export { upload, uploadChapter,updateCourseCover ,chapterFilesStorage };
