import { Router } from "express";
import { createQuiz, updateQuiz, deleteQuiz, getAllQuizzesForCourse } from "../controllers/quizzController";

const router = Router();

router.post('/createQuiz', createQuiz);

router.patch('/updateQuiz/:quizId ', updateQuiz);

router.delete('/deleteQuiz/:quizId', deleteQuiz);

router.get('/quizzes/:courseId', getAllQuizzesForCourse);

export { router as quizRouter };
