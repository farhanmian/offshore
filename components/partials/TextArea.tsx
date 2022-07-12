import React from "react";

const TextArea: React.FC<{
  placeholder: string;
  className?: string;
  row: number;
  name?: string;
  value?: string;
  id?: string;
  error?: string;
  handleForm?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  disabled?: boolean;
  textFont?: string;
  width?: string;
  containerClassName?: string;
  border?: string;
  errorStyle?: string;
}> = ({
  className,
  name,
  placeholder,
  row,
  value,
  disabled,
  handleForm,
  id,
  textFont,
  error,
  width,
  containerClassName,
  border,
  errorStyle,
}) => {
  return (
    <div
      className={`h-max ${
        width ? width : "w-full"
      } ${containerClassName} transition100 relative`}
    >
      <textarea
        id={id}
        placeholder={placeholder}
        className={`focus:outline-none font-medium ${
          textFont ? textFont : "text-sm"
        } ${className} border ${
          error
            ? "border-red-500 focus:border-red-600"
            : `${
                border
                  ? border
                  : "border-gray-200 focus-within:border-gray-400 hover:border-gray-400"
              }`
        }`}
        rows={row}
        name={name}
        value={value}
        onChange={handleForm}
        disabled={disabled}
      />
      {error && error.length > 0 && (
        <p
          className={`${
            errorStyle ? errorStyle : "text-red-700"
          } mt-0.5 text-sm font-medium pl-2 absolute -bottom-4 left-0`}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default TextArea;
