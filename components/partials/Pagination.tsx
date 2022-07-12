import React from "react";
import ArrowDown from "../icons/ArrowDown";

const Pagination: React.FC<{
  className?: string;
  totalPages: string | number;
  currentPage: string | number;
  onClickNext: () => void;
  onClickPrev: () => void;
}> = ({ className, totalPages, currentPage, onClickNext, onClickPrev }) => {
  return (
    <div
      className={`h-10 px-2 rounded flex items-center gap-4 bg-primaryBlue shadow-md w-max text-white ${className}`}
    >
      <span
        className="rotate-90 flex cursor-pointer items-center justify-center border border-gray-200 hover:border-white w-7 h-7 rounded-full bg-white"
        onClick={onClickPrev}
      >
        <ArrowDown />
      </span>
      <p>
        Page{" "}
        <span className="text-primary-main font-semibold">
          {currentPage < 10 ? `0${currentPage}` : currentPage}
        </span>{" "}
        of{" "}
        <span className="text-primary-main font-semibold">
          {totalPages < 10 ? `0${totalPages}` : totalPages}
        </span>
      </p>
      <span
        className="-rotate-90 flex items-center cursor-pointer justify-center border border-gray-200 hover:border-white w-7 h-7 rounded-full bg-white"
        onClick={onClickNext}
      >
        <ArrowDown />
      </span>
    </div>
  );
};

export default Pagination;
