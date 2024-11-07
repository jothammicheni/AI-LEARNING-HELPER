import jwt from "jsonwebtoken";

interface User {
  userId: number; 
}

const generateToken = (user: User): string => {
  const payload = {
    id: user.userId,
  };

  const tokenSecret = process.env.TOKEN_SECRET;
  if (!tokenSecret) {
    throw new Error("TOKEN_SECRET is not defined");
  }

  return jwt.sign(payload, tokenSecret, { expiresIn: '30m' });
};

const generateRefreshToken = (user: User): string => {
  const payload = {
    id: user.userId,
  };
  const refreshToken=process.env.REFRESH_TOKEN
  if (!refreshToken) {
    throw new Error("REFRESH_TOKEN is not defined");
  }

  return jwt.sign(payload, refreshToken, { expiresIn: '7d' });
};


const REFRESH_TOKEN= process.env.REFRESH_TOKEN|| 'Etyyqwetqw7652764y897863h78'; // Use a secure secret

const verifyRefreshToken = (token: string)=> {
  try {    
    const decoded = jwt.verify(token, REFRESH_TOKEN) as jwt.JwtPayload;
    return decoded; 
  } catch (error) {
    console.error('Invalid refresh token:', error);
    return null; 
  }
};
const verifyToken = (token: string)=> {
  try {   
    const tokenSecret = process.env.TOKEN_SECRET|| 'Etyyqwetqw7652764y897863h78';  
    const decoded = jwt.verify(token, tokenSecret ) as jwt.JwtPayload;
    return decoded; 
  } catch (error) {
    console.error('Invalid refresh token:', error);
    return null; 
  }
};

export { generateToken,generateRefreshToken ,verifyRefreshToken,verifyToken };
 