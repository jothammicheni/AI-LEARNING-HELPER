import pool from '../Database/database'; // Use ES module import

// Function to ensure the books table exists
export const ensureTableExists = async () => {
  const tableCheckQuery = `
    SELECT EXISTS (
      SELECT 1 
      FROM information_schema.tables 
      WHERE table_name = 'books'
    );
  `;

  const result = await pool.query(tableCheckQuery);

  const createBooksTableQuery = `
    CREATE TABLE IF NOT EXISTS books (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      year INT NOT NULL
    );
  `;

  if (!result.rows[0].exists) {
    await pool.query(createBooksTableQuery);
  }else{
    console.log('Table already exists')
  }
};

export const createUserTable = async () => {
  const tableCheckQuery = `
    SELECT EXISTS (
      SELECT 1 
      FROM information_schema.tables 
      WHERE table_name = 'users'
    );
  `;

  const result = await pool.query(tableCheckQuery);

  const createUserTableQuery = `
    CREATE TABLE IF NOT EXISTS users(
      userId SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(255) NOT NULL DEFAULT 'subscriber',
      isVerified BOOLEAN NOT NULL DEFAULT false
    );
  `;

  if (!result.rows[0].exists) {
    await pool.query(createUserTableQuery);
  } else {
    console.log('Table already exists');
  }
};
