// authService.ts

import axios from 'axios';
import { UserData } from '../DataTypes';

const BACKEND_URL ='http://localhost:5007'
const API_URL = `${BACKEND_URL}/users/`;
const GOOGLEaUTH_API=`${BACKEND_URL}/api/auth`
const register = async (userData: UserData) => {
    const response = await axios.post(API_URL + 'register', userData);
    console.log(API_URL)
    return response.data;
};


const loginuser = async (userData: UserData) => {
    const response = await axios.post(API_URL + 'login', userData);
    console.log(API_URL)
    return response.data;
};

const loginStatus = async () => {
    const response = await axios.post(API_URL + 'loginStatus');    
    return response.data;
};
const logOutUser = async () => {
    const response = await axios.get(API_URL + 'logout');    
    return response.data;
};
const googleLogin = () => {
    // Redirect the user to initiate the OAuth flow via the backend
    window.location.href = `${GOOGLEaUTH_API}/google`;

    console.log( `${GOOGLEaUTH_API}/google`)
};

export const authService = {
    register,
    loginuser,
    loginStatus,
    logOutUser ,
    googleLogin
};
