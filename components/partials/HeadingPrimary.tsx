import React from "react";

const HeadingPrimary: React.FC<{
  textSize?: string;
  heading: string;
  className?: string;
}> = ({ textSize, heading, className }) => {
  return (
    <h4
      className={`${
        textSize ? textSize : "text-base"
      } ${className} font-bold text-neptuneBlue uppercase`}
    >
      {heading}
    </h4>
  );
};

export default HeadingPrimary;
