// import express from 'express';
// import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import session from 'express-session';
// import dotenv from 'dotenv';

// dotenv.config();

// const app = express();

// // Configure session
// app.use(session({
//     secret: process.env.SESSION_SECRET || 'your_secret_key',
//     resave: false,
//     saveUninitialized: true,
// }));

// // Initialize Passport
// app.use(passport.initialize());
// app.use(passport.session());

// // Configure Passport with Google strategy
// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID!,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     callbackURL: '/auth/google/callback',
// }, (accessToken, refreshToken, profile, done) => {
//     // You can save the user profile in your database here
//     return done(null, profile);
// }));

// // Serialize user
// passport.serializeUser((user: any, done) => {
//     done(null, user);
// });

// // Deserialize user
// passport.deserializeUser((user: any, done) => {
//     done(null, user);
// });

// // Google Auth routes
// app.get('/auth/google', passport.authenticate('google', {
//     scope: ['profile', 'email'],
// }));

// app.get('/auth/google/callback',
//     passport.authenticate('google', { failureRedirect: '/' }),
//     (req, res) => {
//         // Successful authentication
//         res.redirect('/profile');
//     }
// );

// app.get('/profile', (req, res) => {
//     // Ensure user is authenticated before accessing this route
//     if (!req.isAuthenticated()) {
//         return res.redirect('/');
//     }
//     res.send(`<h1>Hello, ${req.user.displayName}</h1><a href="/logout">Logout</a>`);
// });

// app.get('/logout', (req, res) => {
//     req.logout((err) => {
//         if (err) { return next(err); }
//         res.redirect('/');
//     });
// });

// app.get('/', (req, res) => {
//     res.send('<h1>Home</h1><a href="/auth/google">Login with Google</a>');
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });
