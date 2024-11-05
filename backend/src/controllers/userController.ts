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
    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: passwordHash,
      },
    });

    const token = generateToken(user);

    
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

    const refreshToken = generateRefreshToken(user);
    const token = generateToken(user);

    
    res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60* 2), 
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    res.cookie('refreshToken', refreshToken, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400 * 7), // 7 days
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

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

    // Verify  refresh token
    const userData = verifyRefreshToken(refreshToken); 
    if (!userData) {
      res.status(403).json({ message: 'Invalid refresh token' });
      return 
    }

    const user = await prisma.users.findUnique({
      where: { userId: userData.id }, 
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return 
    }

    const token = generateToken(user);
    const newRefreshToken = generateRefreshToken(user);

    res.cookie('refreshToken', newRefreshToken, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400 * 7), 
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 15), // Expires in 15 minutes
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

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
