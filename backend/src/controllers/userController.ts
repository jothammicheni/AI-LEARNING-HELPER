import { Response, Request } from "express";
import prisma from "../config/database";
import bcrypt, { hash } from "bcrypt";
import { generateToken } from "../utils/utils";

const RegisterUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({
        error: 'User already exists with this email'
      });
      return
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    //register user
    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: passwordHash,
      },
    });

    // Generate a token after user creation
    const token = generateToken(user);

    // Set the token in a cookie
    res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // + 1 day
      sameSite: false,
      secure: process.env.NODE_ENV === 'production', // Use secure cookie in production

    });
    const { password: _, ...userData } = user;
    res.status(201).json({ user: userData, token });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({
      error: 'Error registering user'
    });
    return
  }
}

const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        message: 'Email and password are required'
      });
      return
    }

    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(404).json({
        message: 'User not found'
      });
      return
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      res.status(401).json({ message: "Wrong credentials" });
      return
    }

    // Generate JWT token
    const token = generateToken(user);

    // Set the token in a cookie
    res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // Expires in 1 day
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production', // Use secure cookie in production
    });

    // Send user details excluding the password
    const { name, email: userEmail, isVerified, role } = user;
    res.status(200).json({
      message: "User Logged in",
      user: {
        name,
        email: userEmail,
        isVerified,
        role,
        token
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
    return
  }
};


const logoutUser = async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies.token;

  try {
    if (!token) {
      res.status(404).json({
        message: "Token not found"
      });
      return;
    }

    // Clear the token by setting the cookie's expiration date in the past
    res.cookie("token", "", {
      path: "/",
      httpOnly: true,
      expires: new Date(0), // Expired date to remove the cookie
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      message: "Successfully logged out"
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      message: "Error logging out user"
    });
    return
  }
};

const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch all users, excluding sensitive fields (e.g., password)
    const users = await prisma.users.findMany({
      select: {
        userId: true,
        name: true,
        email: true,
        isVerified: true,
        role: true
      },
    });

    res.status(200).json({
      users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
    return
  }
};



export { RegisterUser, loginUser, getAllUsers, logoutUser };
