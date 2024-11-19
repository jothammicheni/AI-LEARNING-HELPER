import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Card from "../../../components/cards/Card";
import Password from "../../../components/textInputs/password/Password";
import { toast } from "react-toastify";
import { cardStyles } from "../../../Tailwind/tailwind";
import { Link, useNavigate } from "react-router-dom";
import Email from "../../../components/textInputs/emailInput/Email";
import { BiLogIn } from "react-icons/bi";
import GoogleLogo from "../../../assets/google.webp";
import "./login.css";
import { useDispatch, useSelector } from "react-redux";
import { googleAuthLogin, login, RESET } from "../../../Redux/Features/Auth/authSlice";
import { AppDispatch, RootState } from "../../../Redux/Features/store";
import Loader from "../../../components/Loader/Loader";
import { useRedirectLoggedInUser } from "../../../customHook/useRedirectLogedOutUsers";

type FormData = { 
  email: string;
  password: string;  
};

const initialState: FormData = {
  email: '',
  password: ''  
};

const Login = () => {
  useRedirectLoggedInUser();
  const [formData, setFormData] = useState<FormData>(initialState);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { isLoading, isLoggedIn, isSuccess } = useSelector((state: RootState) => state.auth);
  
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const LoginUser = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    await dispatch(login(formData));
  };

  const handleGoogleLogin = async () => {
    await dispatch(googleAuthLogin());
};


  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
    dispatch(RESET());
  }, [isLoggedIn, isSuccess, dispatch, navigate]);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-50">
      {isLoading && <Loader />}
      <Card className={`${cardStyles}`} color="white" width="400px">
        <div className="flex justify-center mb-4">
          <BiLogIn size={40} className="text-indigo-500" />
        </div>
        <h1 className="text-indigo-500 text-center font-serif text-2xl mb-6">Sign In</h1>

        <Email
          name="email"
          value={formData.email}
          placeholder="Enter Email"
          onChange={onInputChange}
        />
        <Password
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={onInputChange}
          onPaste={(e) => {
            e.preventDefault();
            toast.error("Cannot paste into this input field");
          }}
        />

        <button
          type="submit"
          onClick={LoginUser}
          className="w-full mt-4 bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors duration-300 shadow-lg transform hover:scale-105"
        >
          <h1 className="text-white font-serif text-2xl py-2">Sign In</h1>
        </button>

        <p className="text-right mt-3 mb-4 text-sm">
          <Link to="/" className="italic text-indigo-600 hover:text-indigo-700 transition-colors duration-200">Forgot password?</Link>
        </p>

        <p className="text-center mb-6">
          Don't have an account?{" "}
          <Link className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors duration-200" to="/register">
            Register
          </Link>
        </p>

        <h2 className="m-2 text-center font-bold">Or</h2>
        <div className="flex items-center border-2 border-indigo-500 rounded-lg transition-transform transform hover:scale-105">
          <img src={GoogleLogo} alt="Google logo" className="ml-2 mr-2 w-8 h-8" />
          <button           
          className="w-full bg-indigo-500 py-2" 
          onClick={
            handleGoogleLogin
            
            }>
            <h1 className="text-white font-serif text-xl">Sign in with Google</h1>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Login;
