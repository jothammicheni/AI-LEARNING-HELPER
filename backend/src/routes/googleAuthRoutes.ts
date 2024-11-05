import { Router } from 'express';
import { googleAuth, googleAuthCallback } from '../controllers/googleAuthController';

const router = Router();

// Initiate Google authentication
router.get('/google', googleAuth);

// Handle the callback after Google has authenticated the user
router.get('/google/callback', googleAuthCallback);

export { router as googleAuthRoutes };
