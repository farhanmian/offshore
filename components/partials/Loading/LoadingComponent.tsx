import React from "react";
import LoadingSpinner from "./LoadingSpinner";

const LoadingComponent: React.FC<{
  loadingSpinnerClassName?: string;
  message: string;
  textFont?: string;
}> = ({ loadingSpinnerClassName, message, textFont }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <LoadingSpinner
        spinnerClassName={
          loadingSpinnerClassName ? loadingSpinnerClassName : "h-12 w-12"
        }
      />
      <p
        className={`font-semibold text-gray-500 mt-5 ${
          textFont ? textFont : "text-lg"
        }`}
      >
        {message}
      </p>
    </div>
  );
};

export default LoadingComponent;
