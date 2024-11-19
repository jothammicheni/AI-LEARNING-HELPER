import React, { useState, useEffect } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import UserSidebar from "../components/sideBars/UserSidebar";
import Dashboard from "../components/dashboard/Dashboard";
import { useRedirectLoggedInUser } from "../customHook/useRedirectLogedOutUsers";
import profile from "../assets/profile.png";
import Footer from "../components/footer/Footer";
import ContactUs from "./contactus/ContactUs";
import Profile from "./Profile/Profile";
import Courses from "./courses/Courses";

const UserDashboard = () => {
  useRedirectLoggedInUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [togglePage, setTogglePage] = useState("dashboard");

  console.log(togglePage)
  // Close sidebar when the Escape key is pressed
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Prevent scrolling when sidebar is open on small screens
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleOverlayClick = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="w-full flex h-screen flex-col lg:flex-row">
      {/* Top Navbar for small screens */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-gray-50 border-b-2 sticky top-0 z-30">
        <h1 className="text-xl font-bold text-indigo-500">Ai Learn</h1>
        <div className="flex gap-3 items-center justify-center">
          <div className="pb-4 w-full border-b-2 border-gray-100 flex justify-center items-center">
            <img
              src={profile}
              className="w-10 h-10 mt-2 rounded-full"
              alt="Profile"
            />
          </div>
          <button
            onClick={toggleSidebar}
            className="text-indigo-500 text-2xl focus:outline-none"
          >
            <AiOutlineMenu />
          </button>
        </div>
      </div>

      {/* Sidebar for large screens or popup for small screens */}
      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-200 bg-opacity-50 z-20 lg:hidden"
          onClick={handleOverlayClick}
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 h-full bg-gray-50 border-r-2 border-gray-100 z-30 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:block lg:w-fit`}
      >
        <UserSidebar toggle={setTogglePage} closeSidebar={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className={`m-1 w-full bg-gray-100 rounded-md flex-1 ${isSidebarOpen ? "overflow-hidden" : "overflow-y-auto"}`}>
        <div className="h-full flex flex-col justify-between">
          {togglePage === "dashboard"?<Dashboard />
           :togglePage === "contact"?<ContactUs/>
           :togglePage === "profile"?<Profile/>
           :togglePage === "course"?<Courses/>
           :<Dashboard/>
           
          }
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
