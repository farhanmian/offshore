import React, { FC } from "react";

const CloseIcon: FC<{ className?: string }> = ({ className }) => {
  return (
    <span>
      <svg className={"w-3 h-auto"} viewBox="0 0 12 12" fill="none">
        <path d="M11 1L1 11" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M1 1L11 11" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </span>
  );
};

export default CloseIcon;
