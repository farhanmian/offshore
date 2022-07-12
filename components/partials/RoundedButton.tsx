import React from "react";

const RoundedButton: React.FC<{
  active: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ active, children, className, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
      text-sm font-bold px-7.5 py-2.5 capitalize rounded-full
      ${className}
      ${active ? "bg-white" : "bg-transparent"} ${
        active ? "text-black" : "text-gray3"
      } ${active ? "shadow-md" : ""} ${active ? "boder border-gray-300" : ""}`}
    >
      {children}
    </button>
  );
};

export default RoundedButton;
