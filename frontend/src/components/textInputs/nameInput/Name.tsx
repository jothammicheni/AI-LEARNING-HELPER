/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import React, { useState, ChangeEvent, ClipboardEvent } from "react";
import { textInputStyles } from "../../../Tailwind/tailwind";
import { BsPerson } from "react-icons/bs";
type Nameprops = {
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    name: string;
    placeholder: string;
    className?:string
};

const Name: React.FC<Nameprops> = ({ value, onChange,  name, placeholder,className }) => {
    return (
        <div className={`${textInputStyles} flex items-center py-2 px-2 mt-4  focus:ring-1 focus:ring-blue-500 transition duration-150`}>
            <BsPerson className="text-gray-400 mr-2" size={25}/>
            <input
                type='text'
                placeholder={placeholder}
                value={value}
                name={name}
                onChange={onChange}
                className='w-full outline-none '
            />
        </div>
    );
};

export default Name;
