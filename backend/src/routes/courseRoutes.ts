import express from 'express';
import {protect } from  "../middleware/protected";
import { addCourses, 
    uploadCover,
    updateCover,
    getCourses,
    getCourseById,
    deleteCourse,
    updateCourse  } from '../controllers/courseControler'; // Adjust the import path

const router = express.Router();

// Route to add a course with file upload
router.post('/add',protect, uploadCover, addCourses);
router.get("/getCourses",getCourses);
router.get('/:id',protect,getCourseById);
router.delete('/:id',protect,deleteCourse ); 
router.patch('/update/:courseId',updateCover,updateCourse );
export {router as courseRoutes}; 
  