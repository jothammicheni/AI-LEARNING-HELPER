import { addCourseChapter,changeFilesToAudio,downloadChapterFile,isComplete } from "../controllers/chapterConroller";
import { Router } from "express";
import { uploadChapter } from "../utils/multerConfig";
import { isTutor, protect } from "../middleware/AuthMiddleware";

const router=Router();

router.post('/add',protect,isTutor,uploadChapter, addCourseChapter)
router.get('/download/:chapterId',protect,downloadChapterFile)
router.post('/completionState/:chapterId',protect,isComplete)
router.post('/speak/:chapterId',protect,changeFilesToAudio);


export {router as chapterRoutes}