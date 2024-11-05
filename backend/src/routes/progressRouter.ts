import { Router } from "express";
import {CreateProgress} from "../controllers/progressController";

const router = Router();

// Route to create a progress record for a specific course
router.post("/addProgress/:courseId",CreateProgress );

// Add additional routes here if needed, for example:
// - Get progress by user and course
// - Update progress
// - Delete progress

export {router as progressRouter};
