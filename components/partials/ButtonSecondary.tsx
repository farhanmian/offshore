import React, { ReactNode } from "react";

const ButtonSecondary: React.FC<{
  className?: string;
  children: ReactNode;
  onClick?: (e?: React.FormEvent | any) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}> = ({ className, children, onClick, type, disabled }) => {
  return (
    <button
      type={type}
      className={`${className} bg-white rounded shadow-sm text-sm ${
        disabled
          ? "text-gray3"
          : "text-secondary-main hover:shadow-md active:shadow-sm"
      } border border-secondary-main font-bold transition100`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default ButtonSecondary;
