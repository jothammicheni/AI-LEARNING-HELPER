import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="w-full bg-teal-600 text-white py-8">
      <div className="container mx-auto px-6 lg:px-8 flex flex-col lg:flex-row justify-between items-center lg:items-start space-y-6 lg:space-y-0">
        
        {/* Logo and Description */}
        <div className="flex flex-col items-center lg:items-start space-y-2 text-center lg:text-left">
          <h1 className="text-2xl font-bold">Ai Learn</h1>
          <p className="text-sm max-w-xs">
            Bringing you the best courses to enhance your skills and knowledge.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col items-center lg:items-start space-y-2 text-center lg:text-left">
          <h2 className="text-lg font-semibold">Quick Links</h2>
          <ul className="text-sm space-y-1">
            <li><a href="/" className="hover:text-teal-200">Home</a></li>
            <li><a href="/courses" className="hover:text-teal-200">Courses</a></li>
            <li><a href="/about" className="hover:text-teal-200">About Us</a></li>
            <li><a href="/contact" className="hover:text-teal-200">Contact</a></li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="flex flex-col items-center lg:items-start space-y-2 text-center lg:text-left">
          <h2 className="text-lg font-semibold">Contact Us</h2>
          <p className="text-sm">Email: Ailearn@gmail.com</p>
          <p className="text-sm">Phone: +2547 456-7890</p>
          <p className="text-sm">Address: 123 Learning St, Nyeri City</p>
        </div>

        {/* Social Media Icons */}
        <div className="flex space-x-4">
          <a href="https://facebook.com" aria-label="Facebook" className="text-white hover:text-teal-200 transition-colors duration-200">
            <FaFacebook size={28} />
          </a>
          <a href="https://twitter.com" aria-label="Twitter" className="text-white hover:text-teal-200 transition-colors duration-200">
            <FaTwitter size={28} />
          </a>
          <a href="https://instagram.com" aria-label="Instagram" className="text-white hover:text-teal-200 transition-colors duration-200">
            <FaInstagram size={28} />
          </a>
          <a href="https://linkedin.com" aria-label="LinkedIn" className="text-white hover:text-teal-200 transition-colors duration-200">
            <FaLinkedin size={28} />
          </a>
        </div>
      </div>

      {/* Footer Bottom Text */}
      <div className="border-t border-teal-500 mt-6 pt-4 text-center text-sm text-teal-200">
        © {new Date().getFullYear()} Ai Learn. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
