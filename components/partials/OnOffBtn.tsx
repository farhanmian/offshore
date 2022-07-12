import React, { useEffect, useState } from "react";

const OnOffBtn: React.FC<{
  className?: string;
  status: string;
  onChangeActiveStatus: () => void;
}> = ({ className, status, onChangeActiveStatus }) => {
  const [activeStatus, setActiveStatus] = useState(
    status === "ENABLED" ? true : false
  );

  useEffect(() => {
    setActiveStatus(status === "ENABLED" ? true : false);
  }, [status]);

  return (
    <div
      className={`w-10 h-5 rounded-full flex items-center px-0.5 transition100 cursor-pointer ${
        activeStatus ? "bg-lightGreen" : "bg-gray3"
      } ${className}`}
      onClick={() => {
        onChangeActiveStatus();
        setActiveStatus(!activeStatus);
      }}
    >
      <span
        className={`inline-block w-[17px] h-[17px] rounded-full bg-white transition100 ${
          activeStatus ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </div>
  );
};

export default OnOffBtn;
