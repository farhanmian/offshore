import Link from "next/link";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import useAuthState from "../../hooks/useAuthState";
import Apple from "../icons/Apple";
import Facebook from "../icons/Facebook";
import Google from "../icons/Google";
import SendIcon from "../icons/SendIcon";
import Input from "../partials/Input";
import TextArea from "../partials/TextArea";

const linkData: { name: string; path: string }[] = [
  { path: "/termsAndConditions", name: "Terms & conditions" },
  { path: "/contactUs", name: "Contact Us" },
  { path: "/aboutUs", name: "About Us" },
];

const Footer = () => {
  const { footerMessageForm, handleFooterMessageForm, postFooterMessageForm } =
    useAuthState();
  const notifySuccess = (message: string) => toast.success(message);
  const notifyError = (err: string) => toast.error(err);

  const [isLoading, setIsLoading] = useState(false);

  const formSubmitHandler = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const res = await postFooterMessageForm();
      console.log("response", res);
      console.log("form submit handler");
      notifySuccess("Thank you for your feedback!");
      setIsLoading(false);
    } catch (err: any) {
      console.log("err", err);
      notifyError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-primaryBlue text-white bottom-0 flex items-center justify-center z-30">
      <div className="flex md:flex-row px-2 sm:px-7 flex-col justify-between py-20 max-w-6xl w-full md:px-2.5">
        <div className="flex ms:flex-col justify-between mb-20 md:mb-0 w-full md:min-w-max m-auto">
          <div className="max-w-full md:max-w-[300px] lg:max-w-[360px] mr-4 sm:mr-10 md:mr-[15px] lg:mr-[40px] xl:mr-[86px]">
            <ul>
              <p className="font-bold text-2xl mb-10 ms:text-center">
                OFFSHORING
              </p>
              <p className="text-sm leading-8 ms:text-center">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet,
                fugiat in! Nesciunt totam soluta quas id, delectus blanditiis
                est, consectetur, exercitationem consequuntur doloribus corporis
                laborum nostrum nam facilis numquam amet.
              </p>
            </ul>
          </div>

          <div className="w-[1px] bg-[#808399] sm:mr-[15px] lg:mr-[40px] xl:mr-[86px] h-[220px] hidden md:inline-block" />

          <div className="md:mr-10 ms:mt-16 min-w-max">
            <h4 className="font-semibold text-base leading-7 uppercase ms:text-center ms:mb-5 mb-10">
              Quick links
            </h4>
            <ul className="ms:grid ms:grid-cols-3 justify-items-center">
              {linkData.map(({ path, name }, i) => {
                return (
                  <li
                    key={name}
                    className={`text-white text-sm font-semibold hover:text-gray-300 cursor-pointer ${
                      linkData.length === i + 1 ? "" : "mb-2"
                    }`}
                  >
                    <Link href={path}>
                      <a>{name}</a>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="max-w-full md:max-w-[400px] lg:max-w-[446px] w-full">
          <div className="flex w-full justify-between items-start">
            <p className="font-semibold text-base uppercase leading-7 mb-10">
              LEAVE US A MESSAGE
            </p>
            <div className="flex items-center hover:text-gray-300 text-white">
              <span className=" mr-3 lg:mr-8 cursor-pointer">
                <Google />
              </span>
              <span className=" mr-3 lg:mr-8 cursor-pointer hover:text-gray-300 text-white">
                <Facebook />
              </span>
              <span className="cursor-pointer hover:text-gray-300 text-white">
                <Apple />
              </span>
            </div>
          </div>

          <p className="font-normal mb-3 text-sm">let us know your thoughts</p>
          <form>
            <Input
              placeholder="Your Email here"
              height="h-[30px]"
              containerClassName={`mb-3 bg-white transition100 ${
                footerMessageForm.email.error ? "mb-8" : ""
              }`}
              className="text-dark font-normal"
              name="email"
              value={footerMessageForm.email.value}
              error={footerMessageForm.email.error}
              handleForm={handleFooterMessageForm}
              errorStyle="text-white"
            />

            <TextArea
              row={4}
              placeholder="Your message"
              name="message"
              className="w-full px-4 py-2.5 rounded text-dark resize-none"
              value={footerMessageForm.message.value}
              error={footerMessageForm.message.error}
              handleForm={handleFooterMessageForm}
              errorStyle="text-white"
              icon={<SendIcon />}
              iconStyles="bottom-3 right-2.5 cursor-pointer icon"
              onIconClick={formSubmitHandler}
            />
          </form>
        </div>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </footer>
  );
};

export default Footer;
