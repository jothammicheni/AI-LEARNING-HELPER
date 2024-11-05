import multer from 'multer';
import { Request, Response } from "express";
import path from 'path';
import fs from 'fs';
import prisma from '../config/database';

// Define storage for the cover images
const courseCoverStorage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    const courseTitle = req.body.title.replace(/\s+/g, '_'); 
    const dir = path.join(__dirname, '../views/courseCovers',courseTitle);

    fs.mkdirSync(dir, { recursive: true });

    cb(null, dir);   },
  filename: (req: Request, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Store with a unique name
  }
});

const updateCoursecover = multer.diskStorage({ 
  
      destination: (req, file, cb) => {
          const courseTitle = req.body.title.replace(/\s+/g, '_'); 
          const dir = path.join(__dirname, '../views/courseCovers', courseTitle);

          if (fs.existsSync(dir)) {
              fs.readdirSync(dir).forEach(file => {
                  const filePath = path.join(dir, file);
                  fs.unlinkSync(filePath);
              });
          } else {
             
              fs.mkdirSync(dir, { recursive: true });
          }

          cb(null, dir); 
      },
      filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, uniqueSuffix + path.extname(file.originalname)); 
      }
  })



const chapterFilesStorage = multer.diskStorage({
  destination: async (req: Request, file, cb) => {
    try {
      const { courseId} = req.body;

      if (!courseId) {
        return new Error('Course ID is required')
      }

       const parsedCourseId = parseInt(courseId, 10);
       if (isNaN(parsedCourseId)) {
         new Error('Invalid Course ID')
       }
 
       const course = await prisma.courses.findFirst({
         where: {
           id: parsedCourseId 
         }
       });

      if (!course) {
        console.log('Course not found');
        return new Error('Course not found')
      }

      const courseTitle = course.title.replace(/\s+/g, '_'); 
      const dir = path.join(__dirname, '../views/chapterFiles', courseTitle); 

      fs.mkdirSync(dir, { recursive: true });

      cb(null, dir);
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


const upload = multer({ storage: courseCoverStorage });
const uploadChapter = multer({ storage: chapterFilesStorage }).single('contentPath');

const updateCourseCover = multer({ storage: updateCoursecover });

export { upload, uploadChapter,updateCourseCover ,chapterFilesStorage };
