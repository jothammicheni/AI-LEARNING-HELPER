import express from 'express';
import {protect,isTutor} from  "../middleware/AuthMiddleware";
import { addCourses, 
    uploadCover,
    updateCover,
    getCourses,
    getCourseById,
    deleteCourse,    
    updateCourse,  
    enrollUserToACourse,
    deleteEnrollment,
    getEnrolledCourses} from '../controllers/courseControler'; 
const router = express.Router();

// Route to add a course with file upload
router.post('/add',protect,isTutor, uploadCover, addCourses);
router.get("/getCourses",protect,getCourses);
router.get('/:id',protect,getCourseById);
router.delete('/:id',protect,isTutor,deleteCourse ); 
router.patch('/update/:courseId',protect,isTutor,updateCourse );
router.post('/enrollToCourse/:courseId',protect,enrollUserToACourse);
router.get('/enrollToCourse/:userId',protect,getEnrolledCourses);
router.delete('/deleteEnrollment/:courseId',protect,deleteEnrollment);



export {router as courseRoutes}; 
  