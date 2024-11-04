import express, { Express, Response, Request } from 'express';
import cors from "cors";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler';
import { userRoutes } from "./routes/userRoutes";
import { courseRoutes } from './routes/courseRoutes';
import dotenv from 'dotenv';
import path from 'path';
import { chapterRoutes } from './routes/chapterRoutes';
import { quizRouter } from './routes/quizRouter';

dotenv.config();

const app: Express = express();


app.use(cors());
// app.use(helmet());
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

// Logging middleware
app.use((req: Request, res: Response, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/users', userRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/chapter', chapterRoutes);
app.use('/api/quizz', quizRouter);
app.use('/courseCovers', express.static(path.join(__dirname, 'views/courseCovers')));
app.use('/chapterFiles', express.static(path.join(__dirname, 'views/chapterFiles')));

app.use(errorHandler);

// Health check route
app.get("/", (req: Request, res: Response) => {
    res.status(200).send("Server is running smoothly!");
});

export { app };
