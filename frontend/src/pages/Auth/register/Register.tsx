/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Card from "../../../components/cards/Card";
import Password from "../../../components/textInputs/password/Password";
import { toast } from "react-toastify";
import { cardStyles } from "../../../Tailwind/tailwind";
import { Link, useNavigate } from "react-router-dom";
import { TiUserAddOutline } from "react-icons/ti";
import Email from "../../../components/textInputs/emailInput/Email";
import Name from "../../../components/textInputs/nameInput/Name";
import './regisster.css'; 
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from '../../../Redux/Features/store';
import { register, RESET } from "../../../Redux/Features/Auth/authSlice";
import Loader from "../../../components/Loader/Loader";

type FormData = {
  name: string;
  email: string;
  password: string;
  password2: string;
};

const initialState: FormData = {
  name: '',
  email: '',
  password: '',
  password2: ''
};

const Register = () => {
  const [formData, setFormData] = useState<FormData>(initialState);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { isLoading, isLoggedIn, isSuccess, message } = useSelector((state: RootState) => state.auth);

  // Handle input change
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const RegisterUser = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.password2) {
      toast.error("Please fill all fields.");
      return;
    }
    if (formData.name.length < 3) {
      toast.error("Name must be at least 3 characters.");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (formData.password !== formData.password2) {
      toast.error("Passwords do not match.");
      return;
    }

    await dispatch(register(formData));
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard');
    }

    dispatch(RESET());
  }, [isLoggedIn, isSuccess, dispatch, navigate]);

  return (
    <div className="full-screen flex items-center justify-center bg-gray-100">
      <div className="background"></div>
      {isLoading && <Loader />}
      <Card className={`${cardStyles} z-10`} color="white" width="400px">
        <div className="flex justify-center mb-6">
          <TiUserAddOutline size={40} className="text-indigo-500" />
        </div>
        <h1 className="text-indigo-500 text-center font-serif text-2xl mb-4">Sign Up</h1>
        
        {/* Form Inputs */}
        <Name
          name="name"
          placeholder="Enter Username"
          value={formData.name}
          onChange={onInputChange}
        />
        <Email
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={onInputChange}
        />
        <Password
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={onInputChange}
          onPaste={(e) => {
            e.preventDefault();
            toast.error("Cannot paste into this input field.");
          }}
        />
        <Password
          name="password2"
          placeholder="Confirm Password"
          value={formData.password2}
          onChange={onInputChange}
          onPaste={(e) => {
            e.preventDefault();
            toast.error("Cannot paste into this input field.");
          }}
        />

        {/* Submit Button */}
        <button
          type="submit"
          onClick={RegisterUser}
          className="w-full mt-4 bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors duration-300 shadow-lg transform hover:scale-105"
        >
          <h1 className="text-white font-serif text-2xl py-2">Sign Up</h1>
        </button>

        {/* Login Link */}
        <p className="text-right mt-3 mb-4 text-sm">
          Have an account?{" "}
          <Link className="italic text-indigo-600 hover:text-indigo-700 transition-colors duration-200" to="/">
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Register;
