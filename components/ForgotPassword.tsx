import { setCookies } from "cookies-next";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import useAuthState from "../hooks/useAuthState";
import Input from "./partials/Input";
import LoadingSpinner from "./partials/Loading/LoadingSpinner";
import img from "../assets/img/forgot-password.png";

const ForgotPassword = () => {
  const router = useRouter();
  const {
    forgotPasswordForm,
    postForgotPasswordForm,
    handleForgotPasswordForm,
  } = useAuthState();
  const [isLoading, setIsLoading] = useState(false);
  const notifyError = (err: string) => toast.error(err);

  const formSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const resp = await postForgotPasswordForm();

      //   setCookies("token", "");
      //   setCookies("token", resp.data.token);

      console.log("resp signIn", resp.data);
      //   router.push("/admin/dashboard");
      setIsLoading(false);
    } catch (err: any) {
      console.log(err);
      setIsLoading(false);
      notifyError(err.message);
    }
  };

  return (
    <div className="bg-screen p-15 flex items-center justify-between w-full rounded-2xl">
      {/* <SignInForm /> */}
      <form
        className="text-dark font-semibold flex flex-col w-2/5"
        onSubmit={formSubmitHandler}
      >
        <p className="text-xs font-semibold text-dark mb-5 text-center">
          Please enter your registered Email ID
        </p>
        <Input
          placeholder="Enter"
          value={forgotPasswordForm.email.value}
          error={forgotPasswordForm.email.error}
          name="email"
          width="w-auto"
          handleForm={handleForgotPasswordForm}
          id="email"
          containerClassName={`${
            forgotPasswordForm.email.error.length === 0 ? "mb-5" : "mb-10"
          } bg-white`}
          disabled={isLoading}
        />
        <button
          className={`uppercase text-white rounded px-2.5 h-10 drop-shadow-md hover:shadow-md disabled:drop-shadow-none ${
            isLoading ? "pointer-events-none" : ""
          }`}
          style={{
            backgroundImage: !isLoading
              ? "linear-gradient(to bottom, #70d3f1 0%,#60c8e7 5%, #119fca 88%, #119fca 98%)"
              : "linear-gradient(rgb(242 242 242) 0%, rgb(171 171 171) 5%, rgb(140 141 141) 88%, rgb(121 122 122) 98%)",
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <LoadingSpinner spinnerClassName="w-6 h-6 m-auto" />
          ) : (
            "RESET"
          )}
        </button>
        <p className="text-xs text-gray3 mt-6 text-center">
          We will email you a link to reset your password
        </p>
        <Toaster position="top-right" reverseOrder={false} />
      </form>

      <div className="h-67.5 w-1 border-l border-gray-400" />

      {/* image */}
      <div className="w-67.5 h-45">
        <Image src={img} alt="img" />
      </div>
    </div>
  );
};

export default ForgotPassword;
