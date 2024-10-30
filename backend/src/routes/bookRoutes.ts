import { Router ,Express, Request, Response }  from 'express'; // Use ES module import
import pool from '../Database/database';
import { ensureTableExists } from '../utils/tables'; // Use ES module import

const router = Router();

// Route to add a book
router.post('/add', async (req:Request, res:Response) => {
  const { title, price, year } = req.body;

  // Validate input
  if (!title || !price || !year) {
  res.status(400).send('Please provide title, price, and year.');
  }

  const insertBookQuery = `
    INSERT INTO books (title, price, year)
    VALUES ($1, $2, $3);
  `;

  try {
    // Ensure the table exists
    await ensureTableExists();
    

    // Insert the new book
    await pool.query(insertBookQuery, [title, price, year]);

    res.status(201).json({message:'Book added successfully.'});
  } catch (err) {
    console.error(err);
    res.status(500).json({message:'Error adding book.'});
  }
});

export default router; // Use ES module export
