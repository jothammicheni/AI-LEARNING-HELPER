import express from 'express';
import { addCourses, 
    uploadCover,
    getCourses,
    getCourseById } from '../controllers/courseControler'; // Adjust the import path

const router = express.Router();

// Route to add a course with file upload
router.post('/add', uploadCover, addCourses);
router.get("/getCourses", getCourses);
router.get('/:id', getCourseById);
export {router as courseRoutes};
  