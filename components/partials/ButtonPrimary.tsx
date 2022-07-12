import React, { ReactNode } from "react";
import NextLink from "next/link";

const ButtonPrimary: React.FC<{
  className?: string;
  children: ReactNode;
  type?: "button" | "reset" | "submit";
  onClick?: () => void;
  disabled?: boolean;
}> = ({ className, children, type, onClick, disabled }) => {
  return (
    <button
      type={type ? type : "button"}
      className={`${className} rounded text-sm font-bold transition100 ${
        disabled
          ? "bg-gray4 text-gray3 "
          : "bg-secondary-main hover:bg-secondary-dark hover:shadow-md active:shadow-sm shadow-sm text-white"
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default ButtonPrimary;
