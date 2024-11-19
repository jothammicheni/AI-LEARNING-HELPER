/* eslint-disable @typescript-eslint/no-unused-vars */
import Password from './components/textInputs/password/Password'
import {BrowserRouter, Routes,Route} from 'react-router-dom'
import './App.css'
import Register from './pages/Auth/register/Register'
import { ToastContainer } from 'react-toastify'
import Login from './pages/Auth/login/Login'
import UserDashboard from './pages/UserDashboard'
import 'react-toastify/dist/ReactToastify.css'
import Loader from './components/Loader/Loader'
import axios from 'axios'
import { useEffect } from 'react'
import { AppDispatch } from './Redux/Features/store';
import { useDispatch } from 'react-redux'
import { loginStatus } from './Redux/Features/Auth/authSlice'
import ActiveUser from './customHook/getLoggedInUser'
import ContactUs from './pages/contactus/ContactUs'
import AddCourse from './pages/AdminComponents/AddCourse'
import CoursePage from './pages/courses/CoursePage'
axios.defaults.withCredentials=true

function App() {
  const dispatch=useDispatch<AppDispatch>()
   
   useEffect(()=>{
    dispatch(loginStatus())
   },[dispatch]) 
   ActiveUser()
   
  return (
  <>
  <BrowserRouter>
  <ToastContainer 
  position='top-center'
/>
  
   <Routes>
   <Route  path='/dashboard' element={<UserDashboard/>}/>
     <Route  path='/register' element={<Register/>}/>
     <Route  path='/' element={<Login/>}/>
     <Route  path='/loader' element={<Loader/>}/>
     <Route  path='/contact' element={<ContactUs/>}/>
     <Route  path='/addCourse' element={<AddCourse/>}/>
     <Route  path='/course/:courseId' element={<CoursePage/>}/>


   </Routes>
  </BrowserRouter>
  </>
  )
}

export default App
