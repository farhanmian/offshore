import React from "react";
import ButtonPrimary from "../../components/partials/ButtonPrimary";
import Logo from "../../components/partials/Logo";
import pattern1 from "../../assets/img/pattern-1.png";
import pattern2 from "../../assets/img/pattern-2.png";
import Image from "next/image";
import { useRouter } from "next/router";

const LandingPage = () => {
  const router = useRouter();

  return (
    <section
      className="h-screen lg:overflow-hidden w-full relative flex items-center px-12"
      style={{ backgroundImage: "linear-gradient(to right,#050C3D, #16B3EF)" }}
    >
      <div className="w-full m-auto">
        <div>
          <Logo className="w-80 h-28 mb-2.5" landingPage />
          <h1 className="text-6xl.1 font-semibold leading text-white mb-11 capitalize">
            Lorem ipsum dolor sit amet
            <br /> <span className="text-6xl">consectetur</span>{" "}
            <span className="text-7xl.1 font-extrabold">adipiscing elit</span>
          </h1>

          <ButtonPrimary
            className="w-50 h-10 px-2.5"
            onClick={() => {
              router.push("/admin/signIn");
            }}
          >
            Let’s get Started
          </ButtonPrimary>
        </div>
      </div>

      {/* pattern images  */}
      <div className="absolute top-2.5 right-3 w-[414px] h-[351px]">
        <Image src={pattern1} alt="pattern1" />
      </div>
      <div className="absolute -bottom-2 left-[18%] w-[500px] ">
        <Image src={pattern2} alt="pattern2" />
      </div>
    </section>
  );
};

export default LandingPage;
