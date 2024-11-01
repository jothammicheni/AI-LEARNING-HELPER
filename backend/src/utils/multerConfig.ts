import multer from 'multer';
import { Request, Response } from "express";
import path from 'path';
import fs from 'fs';

// Define storage for the cover images
const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    const courseTitle = req.body.title.replace(/\s+/g, '_'); // Replace spaces with underscores for folder names
    const dir = path.join(__dirname, '../views/courseCovers',courseTitle);

    // Create the course title directory if it doesn't exist
    fs.mkdirSync(dir, { recursive: true });

    cb(null, dir); // Set the upload path to the course title directory
  },
  filename: (req: Request, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Store with a unique name
  }
});

// Initialize multer
const upload = multer({ storage });

export default upload;
