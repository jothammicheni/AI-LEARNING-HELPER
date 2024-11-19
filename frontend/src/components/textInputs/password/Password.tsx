/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import React, { useState, ChangeEvent, ClipboardEvent } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { textInputStyles } from "../../../Tailwind/tailwind";
import { MdPassword } from "react-icons/md";
import { FaLock } from "react-icons/fa";
type PasswordProps = {
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onPaste?: (event: ClipboardEvent<HTMLInputElement>) => void;
    name: string;
    placeholder: string;
    className?:string
};

const Password: React.FC<PasswordProps> = ({ value, onChange, onPaste, name, placeholder,className }) => {
    const [showPassword, setShowPassword] = useState(true);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={`${textInputStyles} flex items-center py-2 px-2 mt-4  focus:ring-1 focus:ring-blue-500 transition duration-150`}>
            <FaLock className="text-gray-400 mr-3"/>
            <input
                type={showPassword ? "password" : "text"}
                placeholder={placeholder}
                value={value}
                name={name}
                onChange={onChange}
                onPaste={onPaste}
                className='w-full outline-none '
            />
            <div className='' onClick={togglePassword}>
                {showPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                ) : (
                    <AiOutlineEye size={20} />
                )}
            </div>
        </div>
    );
};

export default Password;
