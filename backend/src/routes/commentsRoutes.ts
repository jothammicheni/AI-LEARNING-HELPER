import express from 'express';
import { createComment, getCommentById, updateComment, deleteComment,getCommentsForCourseByUser  } from '../controllers/commentsController';
import { isTutor, protect } from '../middleware/AuthMiddleware';

const router = express.Router();

router.post('/create/:courseId',protect,createComment);
router.get('/getCommentById/:id',protect,getCommentById);
router.patch('/update/:courseId/:id',protect,updateComment);
router.delete('/delete/:courseId/:id',protect,deleteComment);
router.get('/getAllComments/:courseId',protect,getCommentsForCourseByUser);


export {router as commentsRoutes}
