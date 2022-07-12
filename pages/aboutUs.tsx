import React from "react";
import HeadingPrimary from "../components/partials/HeadingPrimary";
import aboutImg from "../assets/img/about-us.png";
import Image from "next/image";

const AboutUs = () => {
  return (
    <section className="h-full max-w-screen-2xl p-3 py-7.5 sm:p-7.5 m-auto">
      <div>
        <HeadingPrimary heading="about us" className="mb-5" />

        {/* text container */}
        <div className="p-3 md:p-7.5 rounded-lg flex flex-col-reverse sm:flex-row items-center md:items-start justify-around border border-gray-300 mb-15 ">
          {/* text */}
          <div className="text-center sm:text-left text-sm w-[95%] sm:w-[60%]">
            <p className="font-bold text-black mb-5">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmodr incid
            </p>
            <div className="font-normal text-dark">
              <p className="mb-3">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmodr incididunt ut labore et dolore magn Lorem ipsum do sit
                amet, coctetur adipiscing elit, sed do eiusmodr incididunt ut
                labore et dolore magn. Susmodr incididunt ut labore et dolore
                magn Lorem ipsum dolor sit amet, coctetur adipiscing elit, sed
                do eiusmodr incididunt ut labore et dolore magn.
              </p>
              <p>
                Dre magn. Susmodr incididunt ut labore et dolore magn Lorem
                ipsum dolor sit amet, coctetur adipiscing elit, sed do eiusmodr
                incididunt ut labore et dolore magn.
              </p>
            </div>
          </div>
          {/* image */}
          <div className="w-56 h-48 mb-5 sm:mb-0 imageContainer justify-self-center">
            <Image src={aboutImg} alt="img" />
          </div>
        </div>

        <div className="py-12 grid grid-cols-2 lg:grid-cols-3 items-center justify-center border border-gray-300 rounded-lg">
          <div className="drop-shadow-md text-center text-secondary-main">
            <h1 className=" ms:text-3xl text-4xl md:text-[45px] font-extrabold">
              200+
            </h1>
            <h2 className="ms:text-2xl text-3xl md:text-[38px] leading-none font-bold">
              Candidates
            </h2>
          </div>
          <div className="drop-shadow-md text-center text-mainOrange">
            <h1 className=" ms:text-3xl text-4xl md:text-[45px] font-extrabold">
              200+
            </h1>
            <h2 className="ms:text-2xl text-3xl md:text-[38px] font-bold leading-none">
              Skills to Add
            </h2>
          </div>
          <div className="drop-shadow-md text-center text-mainBlue mt-10 lg:mt-0 col-span-2 lg:col-span-1">
            <p className="text-sm font-normal">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmodr incididunt ut labore et dolore magn Lorem ipsum do sit
              amet, coctetur adipiscing elit, sed do eiusmodr incididunt ut
              labore et dolore magn. Susmodr incididunt
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
