/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

type CardProps = {
    className?: string;
    children: React.ReactNode;
    color?: string;
    width?: string;
};

const Card: React.FC<CardProps> = ({ className, children, width, color }) => {
    return (
        <div 
            className={className}
            style={{
                backgroundColor: color,
                width: width,
            }}
        >
            {children}
        </div>
    );
};

export default Card;
