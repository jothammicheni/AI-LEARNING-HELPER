import { Request, Response } from 'express';
import passport from 'passport';
import { activeUser } from '../utils/getLoggedInUser';
import { generateRefreshToken, generateToken } from '../utils/utils';

const googleAuth = passport.authenticate('google', {
    scope: ['profile', 'email'],
});

const googleAuthCallback = async (req:Request, res: Response) => {
    try {
        // Get logged-in user
        const user = await activeUser(req, res);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return 
        }

        const token=generateToken(user)
        const newRefreshToken =generateRefreshToken(user)
        res.cookie('token', token, {
            path: '/',
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 60 * 15), 
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
        });

        res.cookie('refreshToken', newRefreshToken, {
            path: '/',
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400 * 7), 
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
        });

        const { name, email,role } = user; 
        res.status(200).json({
            message: 'User logged in with Google',
            user: {
                name,
                email,               
                role,
            },
        });
        return 
    } catch (error) {
        console.error('Error in googleAuthCallback:', error);
       res.status(500).json({ message: 'Internal server error' });
       return 
    }
};

export {googleAuth,googleAuthCallback}