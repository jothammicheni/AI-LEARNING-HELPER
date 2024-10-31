import jwt from "jsonwebtoken";

// Define a type for the user object
interface User {
  userId: number; // Adjust the type based on your user model
}

const generateToken = (user: User): string => {
  const payload = {
    id: user.userId,
  };

  const tokenSecret = process.env.TOKEN_SECRET;
  if (!tokenSecret) {
    throw new Error("TOKEN_SECRET is not defined");
  }

  return jwt.sign(payload, tokenSecret, { expiresIn: '1d' });
};

export { generateToken };
