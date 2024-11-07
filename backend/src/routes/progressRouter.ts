import { Router } from "express";
import {CreateProgress} from "../controllers/progressController";
import { protect } from "../middleware/AuthMiddleware";

const router = Router();

router.post("/addProgress/:courseId",protect,CreateProgress );

export {router as progressRouter};
