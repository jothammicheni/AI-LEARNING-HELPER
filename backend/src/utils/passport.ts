import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { generateToken, generateRefreshToken } from './utils'; 
import prisma from '../config/database';

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const tokenSecret = process.env.TOKEN_SECRET;
console.log(tokenSecret )
if (!googleClientId || !googleClientSecret) {
    throw new Error('Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in environment variables.');
    
}
passport.use(new GoogleStrategy({
    clientID: googleClientId,
    clientSecret: googleClientSecret, 
    callbackURL: "http://localhost:5007/auth/google/callback"
}, async (accessToken:string, refreshToken:string, profile:any, done:Function) => {
    try {
        const { email, name } = profile._json; 
        console.log(profile._json)
        let user = await prisma.users.findUnique({ where: { email } });
        
        if (!user) {
            user = await prisma.users.create({
                data: {
                    
                    name,
                    email,
                    password:""
                    
                },
            });
        }

        // Generate JWT tokens
        const newRefreshToken = generateRefreshToken(user);
        const token = generateToken(user);
        console.log('loggin successful')
        
        done(null, { user, token, newRefreshToken });
    } catch (error) {
        done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj:Object, done) => {
    done(null, obj);
});
