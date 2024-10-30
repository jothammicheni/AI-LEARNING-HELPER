import express, { Express, Request, Response } from 'express'; // Use ES module import
import dotenv from 'dotenv';
import bookRoutes from './routes/bookRoutes'; 
import userRoutes from './routes/userRoutes'; 
import cors from 'cors';
dotenv.config();

const app: Express = express();

 app.use(express.json());
app.use(cors())

app.use('/books', bookRoutes);
app.use('/api/users', userRoutes); 
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

// Start the server
const PORT: number = Number(process.env.PORT) || 3006;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
