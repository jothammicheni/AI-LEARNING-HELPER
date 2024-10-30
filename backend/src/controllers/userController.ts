import { createUserTable } from '../utils/tables';
import pool from "../Database/database";
import { Response, Request } from 'express';
import bcrypt from 'bcrypt';

const RegisterUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body; // Use req.body instead of req.params

  // Validate input
  if (!name || !email || !password) {
    res.status(400).json({ error: "Please fill all the fields" });
    return;
  }

  try {
    // Check if the user already exists
    const userCheckQuery = `
      SELECT * FROM users WHERE email = $1;
    `;
    const userCheckResult = await pool.query(userCheckQuery, [email]);

    if (userCheckResult.rows.length > 0) {
      res.status(409).json({ error: "User already exists" });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert new user into the database
    const insertUserQuery = `
      INSERT INTO users (name, email, password, role, isVerified) 
      VALUES ($1, $2, $3, 'subscriber', false) RETURNING *;  -- Return all columns
    `;
    const insertUserResult = await pool.query(insertUserQuery, [name, email, hashedPassword]);

    // Respond with success and user data
    const newUser = insertUserResult.rows[0]; // Get the newly created user

    res.status(201).json({
      message: "User registered successfully",
      user: {
        userId: newUser.userid,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isVerified: newUser.isverified // Adjust based on your column names
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export { RegisterUser };
