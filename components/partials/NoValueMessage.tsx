import React from "react";

const NoValueMessage = ({ children }: any) => {
  return (
    <p className="text-center left-1/2 top-1/2 absolute -translate-x-1/2 -translate-y-1/2 font-bold text-lg block">
      {children}
    </p>
  );
};

export default NoValueMessage;
