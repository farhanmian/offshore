import React from "react";

const ArrowDown: React.FC<{ color?: string }> = ({ color }) => {
  return (
    <svg
      width="14"
      height="8"
      viewBox="0 0 14 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 1L6.29289 6.29289C6.68342 6.68342 7.31658 6.68342 7.70711 6.29289L13 1"
        stroke={color ? color : "#828282"}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default ArrowDown;
