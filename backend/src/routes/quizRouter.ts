import { Router } from "express";
import { createQuiz, updateQuiz, deleteQuiz, getAllQuizzesForCourse } from "../controllers/quizzController";
import { protect } from "../middleware/AuthMiddleware";

const router = Router();

router.post('/createQuiz',protect, createQuiz);

router.patch('/updateQuiz/:quizId ',protect, updateQuiz);

router.delete('/deleteQuiz/:quizId',protect, deleteQuiz);

router.get('/quizzes/:courseId',protect, getAllQuizzesForCourse);

export { router as quizRouter };
