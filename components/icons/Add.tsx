import React from "react";

const Add: React.FC<{ color?: string }> = ({ color }) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.0711 9.00002H1.92893"
        stroke={color ? color : "#828282"}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8.99998 1.92893V16.0711"
        stroke={color ? color : "#828282"}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Add;
