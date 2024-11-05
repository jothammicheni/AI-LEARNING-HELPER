import { Router } from "express";
import {CreateProgress} from "../controllers/progressController";

const router = Router();

router.post("/addProgress/:courseId",CreateProgress );

export {router as progressRouter};
