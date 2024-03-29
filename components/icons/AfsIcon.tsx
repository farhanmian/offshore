import React from "react";

const AfsIcon: React.FC<{ color?: string }> = ({ color }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 46 53"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M41.1057 15.236L29.8424 26.4993L3.6838 0.363647L0.781982 3.26498L26.9406 29.4236L21.1606 35.2036L6.42434 20.4674L3.52301 23.3687L18.2593 38.105L8.27577 48.0662L4.16362 52.1783H9.9664L41.1062 52.1788H45.2183V11.124L41.1057 15.236ZM41.1057 48.0661H14.0783L21.1377 41.0067L23.4451 43.314L26.3464 40.4127L24.039 38.1053L29.8191 32.3253L36.0104 38.5167L38.9118 35.6154L32.7204 29.424L41.0823 21.062L41.0828 48.0664L41.1057 48.0661Z"
        fill={color ? color : "#16B3EF"}
      />
    </svg>
  );
};

export default AfsIcon;
