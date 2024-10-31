import multer from 'multer';
import {Request,Response} from "express";
import path from 'path';

// Define storage for the cover images
const storage = multer.diskStorage({
  destination: (req:Request, file, cb) => {
    cb(null, path.join(__dirname, '../views/courseCovers')); // Set the upload path
  },
  filename: (req:Request, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Store with a unique name
  }
});

// Initialize multer
const upload = multer({ storage });

export default upload;
