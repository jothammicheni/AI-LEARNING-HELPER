import express from 'express';
import {RegisterUser} from '../controllers/userController'; 
import { createUserTable } from '../utils/tables';

const router = express.Router();

// Middleware to create user table if it doesn't exist
createUserTable();

// Route for user registration
router.post('/register', RegisterUser);

// You can add more user-related routes here, such as:
// router.post('/login', LoginUser);
// router.get('/profile', GetUserProfile);
// router.put('/update', UpdateUser);
// router.delete('/delete', DeleteUser);

export default router;
