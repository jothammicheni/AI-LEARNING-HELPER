import { Router } from "express";
import { RegisterUser, loginUser,getAllUsers,logoutUser} from "../controllers/userController";
import {protect } from  "../middleware/protected";

const router = Router(); // No need to create an Express app here

// User registration route
router.post("/register", RegisterUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/getUsers",protect ,getAllUsers);
export { router as userRoutes };
