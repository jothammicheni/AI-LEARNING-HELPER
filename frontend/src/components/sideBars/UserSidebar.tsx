import React from "react";
import { BiLogOut } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { RxDashboard } from "react-icons/rx";
import { SiCoursera } from "react-icons/si";
import { MdEmail } from "react-icons/md"; // Import the mail icon

import { Link } from "react-router-dom";
import profile from "../../assets/profile.png";
import { AppDispatch, RootState } from "../../Redux/Features/store";
import { useDispatch, useSelector } from "react-redux";
import { logout, RESET } from "../../Redux/Features/Auth/authSlice";
import ActiveUser from "../../customHook/getLoggedInUser";

interface UserSidebarProps {
  closeSidebar: () => void;
  toggle: React.Dispatch<React.SetStateAction<string>>; // Ensure toggle is defined here
}

const UserSidebar: React.FC<UserSidebarProps> = ({ closeSidebar, toggle }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.auth);
  const {user}=ActiveUser()
  const logoutUser = async () => {
    if (!isLoading) {
      dispatch(RESET());
      await dispatch(logout());
    }
    closeSidebar();
  };

  return (
    <div className="w-full lg:w-fit p-4 bg-teal-50 flex flex-col h-full text-gray-900">
      <div
        onClick={() => toggle('dashboard')} // Use an arrow function to delay the call
        className="pb-4 w-full border-b border-teal-200 flex justify-center items-center"
      >
        <img src={profile} className="w-12 h-12 mt-2 rounded-full" alt="Profile" />
        <p className="mt-2 ml-3 text-teal-700 font-semibold">{user?.name}</p>
      </div>
      
      <div className="flex-grow pt-5">
        <ul className="pl-5 space-y-6">
          <li className="text-gray-800 hover:text-teal-700 transition-transform transform hover:scale-105">
            <Link
              to="/dashboard"
              className="flex items-center gap-2"
              onClick={() => {
                closeSidebar(); // Close sidebar on click
                toggle('dashboard'); // Call toggle on click
              }}
            >
              <RxDashboard aria-label="Dashboard Icon" />
              <p>Dashboard</p>
            </Link>
          </li>
          <li className="text-gray-800 hover:text-teal-700 transition-transform transform hover:scale-105">
            <Link
            to=''
              onClick={() => {
                closeSidebar(); // Close sidebar on click
                toggle('course'); // Call toggle on click
              }}
              className="flex items-center gap-2"
            >
              <SiCoursera aria-label="Courses Icon" />
              <p>Courses</p>
            </Link>
          </li>
          <li className="text-gray-800 hover:text-teal-700 transition-transform transform hover:scale-105">
            <Link
            to=''
              onClick={() => {
                closeSidebar(); // Close sidebar on click
                toggle('profile'); // Call toggle on click
              }}
              className="flex items-center gap-2"
            >
              <CgProfile aria-label="Profile Icon" />
              <p>Profile</p>
            </Link>
          </li>

<li className="text-gray-800 hover:text-teal-700 transition-transform transform hover:scale-105">
  <Link
    to=""
    onClick={() => {
      closeSidebar(); // Close sidebar on click
      toggle("contact"); // Call toggle on click
    }}
    className="flex items-center gap-2"
  >
    <MdEmail aria-label="Contact Icon" />
    <p>Contact Us</p>
  </Link>
</li>

        </ul>
      </div>
      
      <div className="p-4">
        <ul className="pl-5">
          <li className="text-gray-800 hover:text-red-600 transition-transform transform hover:scale-105">
            <Link
              onClick={logoutUser}
              to="/"
              className="flex items-center gap-2"
            >
              <BiLogOut aria-label="Logout Icon" />
              <p>Logout</p>
            </Link>
          </li>
        </ul>
      </div>
      
      <p className="text-center text-gray-600 text-xs mt-auto pb-4">
        © {new Date().getFullYear()} Ai Learn
      </p>
    </div>
  );
};

export default UserSidebar;
