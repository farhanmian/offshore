import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Location from "../components/icons/Location";
import Message from "../components/icons/Message";
import Telephone from "../components/icons/Telephone";
import ButtonPrimary from "../components/partials/ButtonPrimary";
import ButtonSecondary from "../components/partials/ButtonSecondary";
import HeadingPrimary from "../components/partials/HeadingPrimary";
import Input from "../components/partials/Input";
import LoadingSpinner from "../components/partials/Loading/LoadingSpinner";
import TextArea from "../components/partials/TextArea";
import useAuthState from "../hooks/useAuthState";

const ContactUs = () => {
  const {
    contactUsForm,
    handleContactUsForm,
    postContactUsForm,
    clearContactUsForm,
  } = useAuthState();
  const notifySuccess = (message: string) => toast.success(message);
  const notifyError = (err: string) => toast.error(err);
  const [isLoading, setIsLoading] = useState(false);

  const formSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    try {
      setIsLoading(true);
      const resp: any = await postContactUsForm();
      if (resp.status !== 200) {
        throw Error(resp);
      }
      notifySuccess("Main successfully send");
      clearContactUsForm();
      setIsLoading(false);
    } catch (err: any) {
      console.log(err);
      notifyError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <section className="h-full max-w-screen-2xl py-7.5 px-3 sm:p-7.5 m-auto mb-20">
      <div className="w-full">
        <HeadingPrimary heading="contact us" className="mb-7" />

        <div className="w-full flex flex-col lg:flex-row justify-between relative p-5 md:p-15 md:pl-17.5 pt-17.5 text-white rounded-lg min-h-[577px] contactPageImage">
          {/* text container */}
          <div className="flex flex-col justify-between mb-16 lg:mb-0 lg:h-[440px] lg:max-w-xl">
            <div className="mb-15 lg:mb-0">
              <h5 className="font-semibold text-xl mb-2">
                Measure your candidates on
              </h5>
              <h2 className="font-extrabold text-[32px] ">
                Job skills, Personality and Fit
              </h2>
            </div>

            <div>
              <span className="flex items-start gap-x-6 mb-3">
                <span className="mt-1">
                  <Message />
                </span>
                <p>nodummyexample01@gmail.com</p>
              </span>
              <span className="flex items-start gap-x-6 mb-3">
                <span className="mt-1">
                  <Telephone />
                </span>
                <p>(033) 2659 5966</p>
              </span>
              <span className="flex items-start gap-x-6">
                <span className="mt-1">
                  <Location />
                </span>
                <p>
                  Victoria Memorial Hall, 1, Queens Way, Maidan, Kolkata, West
                  Bengal 700071
                </p>
              </span>
            </div>
          </div>

          {/* phone img */}
          <div className="xl:absolute xl:h-[120%] w-full lg:w-1/3 xl:w-[365px] xl:right-16 -top-14 rounded-lg flex flex-col justify-center xl:p-10 xl:py-20 xl:bg-transparent aboutPageImage">
            <p className="font-bold text-xl lg:text-sm xl:text-xs text-white xl:text-black mb-4">
              Drop a Message
            </p>
            <form
              onSubmit={formSubmitHandler}
              className="rounded xl:p-5 xl:bg-gray5 w-full flex-1 text-black"
            >
              <Input
                placeholder="Full Name"
                className="px-3 h-10"
                containerClassName={`${
                  contactUsForm.name.error ? "mb-8" : "mb-3"
                } w-full bg-white`}
                name="name"
                error={contactUsForm.name.error}
                errorStyle="pl-2 pt-2 text-white xl:text-red-700"
                disabled={isLoading}
                value={contactUsForm.name.value}
                handleForm={handleContactUsForm}
              />
              <Input
                placeholder="email"
                className="px-3 h-10"
                containerClassName={`${
                  contactUsForm.email.error ? "mb-8" : "mb-3"
                } w-full bg-white`}
                name="email"
                error={contactUsForm.email.error}
                errorStyle="pl-2 pt-2 text-white xl:text-red-700"
                disabled={isLoading}
                value={contactUsForm.email.value}
                handleForm={handleContactUsForm}
              />
              <Input
                placeholder="phone"
                className="px-3 h-10"
                containerClassName={`${
                  contactUsForm.phone.error ? "mb-8" : "mb-3"
                } w-full bg-white`}
                name="phone"
                error={contactUsForm.phone.error}
                errorStyle="pl-2 pt-2 text-white xl:text-red-700"
                disabled={isLoading}
                value={contactUsForm.phone.value}
                handleForm={handleContactUsForm}
              />

              <TextArea
                placeholder="Message"
                row={5}
                name="message"
                value={contactUsForm.message.value}
                error={contactUsForm.message.error}
                disabled={isLoading}
                errorStyle={"text-white xl:text-red-700"}
                handleForm={handleContactUsForm}
                className="p-3 w-full resize-none rounded disabled:bg-white"
                containerClassName={
                  contactUsForm.message.error ? "mb-7" : "mb-3"
                }
              />

              <ButtonPrimary
                type="submit"
                className="w-full h-10 hidden xl:inline-block"
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingSpinner spinnerClassName="h-6 w-6 m-auto" />
                ) : (
                  "Submit"
                )}
              </ButtonPrimary>
              <div className="xl:hidden w-full flex justify-end">
                <ButtonSecondary
                  disabled={isLoading}
                  type="submit"
                  className="px-12 h-10"
                >
                  {isLoading ? (
                    <LoadingSpinner spinnerClassName="h-6 w-6 m-auto" />
                  ) : (
                    "Submit"
                  )}
                </ButtonSecondary>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </section>
  );
};

export default ContactUs;
