import { Response, Request, NextFunction } from "express";
import prisma from "../config/database";
import bcrypt, { hash } from "bcrypt";

import { generateRefreshToken, generateToken, verifyRefreshToken } from "../utils/utils";
import { validateLoginInputs, validateRegisterInputs } from "../middleware/validators";
import { activeUser } from "../utils/getLoggedInUser";

const RegisterUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const validationError = validateRegisterInputs(name, email, password);
    if (validationError) {
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
      expires: new Date(Date.now() + 1000 *60*5), // + 1 day
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

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
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
      expires: new Date(Date.now() + 1000 * 60 * 5),
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
const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await prisma.users.findUnique({
      where: { userId: Number(userId) },
    });

    if (!user) {
      res.status(404).json({ message: `User with id ${userId} not found` });
      return;
    }

    await prisma.users.delete({
      where: { userId: Number(userId) },
    });

    res.status(200).json({ message: `User with id ${userId} has been deleted successfully` });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Error deleting user" });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { name, email, password } = req.body;

    const user = await prisma.users.findUnique({
      where: { userId: Number(userId) },
    });

    if (!user) {
      res.status(404).json({ message: `User with id ${userId} not found` });
      return;
    }

    const updateData: { name?: string; email?: string; password?: string } = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      updateData.password = passwordHash;
    }

    // Update the user
    const updatedUser = await prisma.users.update({
      where: { userId: Number(userId) },
      data: updateData,
    });

    const { password: _, ...userData } = updatedUser;
    res.status(200).json({ message: "User updated successfully", user: userData });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Error updating user" });
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
const loginStatus = async (req: Request, res: Response) => {
  const { token, refreshToken } = req.cookies;
  const refreshSecret = process.env.REFRESH_TOKEN;
try{
  if (!refreshSecret) {
    res.status(500).json({ message: 'REFRESH_TOKEN environment variable not found' });
    return;
  }

  if (!token && !refreshToken) {
    res.json(false);
    return;
  }
  if (refreshToken) {
    const userData = verifyRefreshToken(refreshToken);
    if (!userData) {
      res.json(false);
      return;
    }

    const user = await prisma.users.findUnique({
      where: { userId: userData.id },
    });

    if (!user) {
      res.json(false);
      return;
    }

    const newToken = generateToken(user);
    const newRefreshToken = generateRefreshToken(user);

    res.cookie('token', newToken, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 30),
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(200).json(true);
    return;
  }

  if (token) {
    res.status(200).json(true);
    return;
  }

  res.json(false);
}catch(error){
  res.status(500)
  res.json({'server error:':error})
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

const getLoggedInUser = async (req: Request, res: Response) => {
  try {
    const user =await activeUser(req, res);
    console.log('Retrieved user:', user); 
    if (!user) {
      res.status(404).json({ message: 'User not found: Login first' });
      return 
    }

   res.status(200).json({ user });
   return 
  } catch (error) {
    console.error('Error retrieving logged-in user:', error);
    res.status(500).json({ message: 'Internal server error' });
    return 
  }
};


export {
  RegisterUser,
  loginUser,
  getAllUsers,
  logoutUser,
  loginStatus,
  deleteUser,
  updateUser,
  getLoggedInUser
};
