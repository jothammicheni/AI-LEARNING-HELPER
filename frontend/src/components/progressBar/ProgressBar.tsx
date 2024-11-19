
import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface ProgressTypes {
  value: number;
  title: string;
  text: string;
}

const ProgressBar: React.FC<ProgressTypes> = ({ value, title, text }) => {
  return (
    <div className="text-center p-3 flex flex-col items-center border border-gray-200 rounded-lg shadow-md bg-white">
      <p className="text-md font-semibold text-gray-800 mb-2">{title}</p>
      <div className="w-20 h-20">
        <CircularProgressbar 
          value={value} 
          text={text} 
          styles={{
            path: { stroke: "#FF6B6B" }, // Coral color for progress path
            text: { fill: "#008080", fontSize: "18px", fontWeight: "bold" } // Teal for percentage text
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
