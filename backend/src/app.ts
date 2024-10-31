import express, { Express, Response, Request } from 'express';
import cors from "cors";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorHandler';
import { userRoutes } from "./routes/userRoutes";
import dotenv from 'dotenv';
import { protect } from './middleware/protected';
dotenv.config();

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json()); // Add this to parse JSON request bodies
app.use(bodyParser.json());
app.use(cookieParser());
// Routes
app.use('/users', userRoutes);

// Error handling middleware
app.use(errorHandler);


// Health check route
app.get("/", (req: Request, res: Response) => {
    res.status(200).send("hello");
   
});

export { app };
