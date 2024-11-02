import { Router } from "express";
import { RegisterUser, loginUser,getAllUsers,logoutUser} from "../controllers/userController";
import {protect,isAdmin} from  "../middleware/AuthMiddleware";

const router = Router(); 


router.post("/register", RegisterUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/getUsers",protect,isAdmin,getAllUsers);

export { router as userRoutes };
