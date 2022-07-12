import React from "react";
import logo1 from "../../assets/img/logo-1.png";
import logo2 from "../../assets/img/logo-2.png";
import Image from "next/image";
import NextLink from "next/link";

const Logo: React.FC<{
  className: string;
  landingPage?: boolean;
}> = ({ className, landingPage }) => {
  return (
    <div className={`${className}`}>
      <NextLink href={landingPage ? "/admin" : "/admin/dashboard"}>
        <a className="w-full h-full">
          <Image src={landingPage ? logo1 : logo2} alt="logo" />
        </a>
      </NextLink>
    </div>
  );
};

export default Logo;
