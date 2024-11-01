import express, { Express, Response, Request } from 'express';
import cors from "cors";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorHandler';
import { userRoutes } from "./routes/userRoutes";
import { courseRoutes } from './routes/courseRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
// Routes
app.use('/users', userRoutes);
app.use('/api/course', courseRoutes );

// Error handling middleware
app.use(errorHandler);
// Health check route
app.get("/", (req: Request, res: Response) => {
    res.status(200).send("hello");
   
});

export { app };
