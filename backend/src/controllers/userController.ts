import { Response, Request,NextFunction } from "express";
import prisma from "../config/database";
import bcrypt, { hash } from "bcrypt";
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { generateRefreshToken, generateToken, verifyRefreshToken } from "../utils/utils";
import { validateLoginInputs, validateRegisterInputs } from "../middleware/validators";

const RegisterUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

   const validationError= validateRegisterInputs(name, email, password);
   if(validationError){
    res.status(400).json({ message: validationError });
            return 
   }


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
      secure: process.env.NODE_ENV === 'production', 

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

const loginUser = async (req: Request, res: Response,next:NextFunction)=> {
  try {
    const { email, password } = req.body;

    // Validate input 
    const validationError = validateLoginInputs(email, password);
        if (validationError) {
            res.status(400).json({ message: validationError });
            return 
        }
    
   
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      res.status(401).json({ message: 'Wrong credentials' });
      return;
    }

    // Generate JWT tokens
    const refreshToken = generateRefreshToken(user);
    const token = generateToken(user);

    // Set the access token in a cookie
    res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60* 2), // Expires in 15 minutes
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    // Set the refresh token in a cookie
    res.cookie('refreshToken', refreshToken, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400 * 7), // Expires in 7 days
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    // Send user details excluding the password
    const { name, email: userEmail, isVerified, role } = user;
    res.status(200).json({
      message: 'User Logged in',
      user: {
        name,
        email: userEmail,
        isVerified,
        role,
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
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
const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.cookies; // Get the refresh token from cookies

    if (!refreshToken) {
      res.status(401).json({ message: 'Refresh token is required' });
      return 
    }

    // Verify the refresh token
    const userData = verifyRefreshToken(refreshToken); 
    if (!userData) {
      res.status(403).json({ message: 'Invalid refresh token' });
      return 
    }

    // Check if the user exists in the database 
    const user = await prisma.users.findUnique({
      where: { userId: userData.id }, // Assuming userData contains the user ID
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return 
    }

    // Generate new access token and optionally a new refresh token
    const token = generateToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Set the new refresh token in a cookie
    res.cookie('refreshToken', newRefreshToken, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400 * 7), // Expires in 7 days
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    // Set the new access token in a cookie
    res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 15), // Expires in 15 minutes
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    // Send the new access token back to the client
    res.status(200).json({
      accessToken: token,
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ message: 'Internal server error' });
    return
  }
};


export { RegisterUser, loginUser, getAllUsers, logoutUser,refreshToken  };
