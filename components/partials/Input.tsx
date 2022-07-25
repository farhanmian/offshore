import React, { Fragment } from "react";

const Input: React.FC<{
  className?: string;
  width?: string;
  height?: string;
  placeholder: string;
  icon?: React.ReactElement;
  shadow?: boolean;
  containerClassName?: string;
  value?: string;
  name?: string;
  error?: string;
  type?: string;
  errorStyle?: string;
  id?: string;
  handleForm?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  disabled?: boolean;
  rounded?: string;
  autoFocus?: boolean;
  border?: string;
  onBlur?: () => void;
  onFocus?: () => void;
}> = ({
  className,
  width,
  height,
  placeholder,
  icon,
  shadow,
  containerClassName,
  name,
  error,
  errorStyle,
  id,
  handleForm,
  value,
  disabled,
  rounded,
  autoFocus,
  border,
  type,
  onBlur,
  onFocus,
}) => {
  return (
    <div
      className={`${width ? width : "w-full"} ${
        height ? height : "h-10"
      } ${containerClassName}  ${
        shadow ? "shadow-md drop-shadow-sm" : ""
      } border box-content ${
        error && error.length > 0
          ? "border-red-500 focus:border-red-600"
          : `${
              border
                ? border
                : "border-gray-200 focus-within:border-gray-400 hover:border-gray-400"
            }`
      }  ${rounded ? rounded : "rounded"} transition100 relative`}
    >
      <input
        value={value}
        type={type}
        id={id}
        autoFocus={autoFocus}
        name={name}
        className={`${className} ${
          rounded ? rounded : "rounded"
        } bg-transparent input focus:outline-none absolute top-0 left-0 w-full h-full text-sm font-semibold`}
        placeholder={placeholder}
        onChange={handleForm}
        disabled={disabled}
        onFocus={onFocus}
        onBlur={onBlur}
      />

      {icon && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2">
          {icon}
        </span>
      )}

      {error && error.length > 0 && (
        <p
          className={`${
            errorStyle ? errorStyle : "pl-2 pt-2 text-red-700"
          } mt-0.5 text-sm z-20 font-medium absolute -bottom-6 left-0 capitalize`}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
