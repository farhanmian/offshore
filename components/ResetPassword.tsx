import { setCookies } from "cookies-next";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import useAuthState from "../hooks/useAuthState";
import Input from "./partials/Input";
import img from "../assets/img/reset-password.png";

const ResetPassword = () => {
  const router = useRouter();
  const { resetPasswordForm, handleResetPasswordForm, postResetPasswordForm } =
    useAuthState();
  const [isLoading, setIsLoading] = useState(false);
  const notifyError = (err: string) => toast.error(err);

  const formSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const resp = await postResetPasswordForm();
      //   console.log("resp signIn", resp);
      //   setCookies("token", "");
      //   setCookies("token", resp.data.token);
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
        <label htmlFor="email" className="mb-2 text-xs">
          New Password
        </label>

        <Input
          placeholder="Enter New Password"
          value={resetPasswordForm.password.value}
          error={resetPasswordForm.password.error}
          name="password"
          width="w-auto"
          type="password"
          handleForm={handleResetPasswordForm}
          id="email"
          containerClassName={`${
            resetPasswordForm.password.error.length === 0 ? "mb-5" : "mb-15"
          } bg-white`}
          disabled={isLoading}
        />

        <label htmlFor="password" className="mb-2 text-xs">
          Confirm Password
        </label>

        <Input
          placeholder="Confirm Password"
          value={resetPasswordForm.confirmPassword.value}
          error={resetPasswordForm.confirmPassword.error}
          name="confirmPassword"
          type="password"
          width="w-auto"
          handleForm={handleResetPasswordForm}
          id="password"
          containerClassName={`${
            resetPasswordForm.confirmPassword.error.length === 0
              ? "mb-5"
              : "mb-12"
          } bg-white`}
          disabled={isLoading}
        />

        <button
          className={`uppercase text-white rounded px-2.5 h-10 drop-shadow-md hover:shadow-md ${
            isLoading ? "pointer-events-none" : ""
          }`}
          style={{
            backgroundImage:
              "linear-gradient(to bottom, #70d3f1 0%,#60c8e7 5%, #119fca 88%, #119fca 98%)",
          }}
          disabled={isLoading}
        >
          RESET PASSWORD
        </button>

        <a className="text-sm font-normal text-darkSkyBlue mt-6 text-center">
          CANCEL
        </a>

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

export default ResetPassword;
