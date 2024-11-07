import { Router } from "express";
import {protect,isAdmin} from  "../middleware/AuthMiddleware";
import { RegisterUser,
     loginUser,
     getAllUsers,
     logoutUser,     
     loginStatus,
     deleteUser,
     updateUser,
     getLoggedInUser  } from "../controllers/userController";


const router = Router(); 


router.post("/register", RegisterUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.delete("/delete/:userId",protect,isAdmin,deleteUser);
router.patch("/update/:userId",updateUser);
router.get("/getUsers",protect,isAdmin,getAllUsers);
router.get("/getLoggedInUser",protect,getLoggedInUser);
router.post("/loginStatus",loginStatus);




export { router as userRoutes };
