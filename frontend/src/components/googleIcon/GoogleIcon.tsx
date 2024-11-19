import React from 'react';
import { FaGoogle } from 'react-icons/fa';
import './GoogleIcon.css'; // Import the CSS file

const GoogleIcon: React.FC = () => {
  return (
    <div className="google-icon">
      <FaGoogle size={20} className="m-3" />
    </div>
  );
};

export default GoogleIcon;
