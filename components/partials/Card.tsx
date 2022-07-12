import React from "react";

const Card: React.FC<{
  className: string;
  shadow?: string;
  children: React.ReactNode;
}> = ({ className, shadow, children }) => {
  return (
    <div className={`${className} ${shadow ? shadow : "shadow-md"}`}>
      {children}
    </div>
  );
};

export default Card;
