import { setCookies } from "cookies-next";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import useAuthState from "../hooks/useAuthState";
import Input from "./partials/Input";
import img from "../assets/img/sign-in-img.png";
import LoadingSpinner from "./partials/Loading/LoadingSpinner";

const SignInForm = () => {
  const router = useRouter();
  const { signInForm, handleSignInForm, postSignInForm } = useAuthState();
  const [isLoading, setIsLoading] = useState(false);
  const notifyError = (err: string) => toast.error(err);

  const formSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const resp = await postSignInForm();
      if (resp && resp.status === 200) {
        console.log("resp signIn", resp);
        setCookies("token", "");
        setCookies("token", resp.data.token);
        router.push("/admin/dashboard");
      } else {
        setIsLoading(false);
      }
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
          Email Id/Mobile No.
        </label>

        <Input
          placeholder="Enter"
          value={signInForm.email.value}
          error={signInForm.email.error}
          name="email"
          width="w-auto"
          handleForm={handleSignInForm}
          id="email"
          containerClassName={`${
            signInForm.email.error.length === 0 ? "mb-5" : "mb-10"
          } bg-white`}
          disabled={isLoading}
        />

        <label htmlFor="password" className="mb-2 text-xs">
          Password
        </label>

        <Input
          placeholder="Enter"
          value={signInForm.password.value}
          error={signInForm.password.error}
          name="password"
          type="password"
          width="w-auto"
          handleForm={handleSignInForm}
          id="password"
          containerClassName={`${
            signInForm.password.error.length === 0 ? "mb-5" : "mb-12"
          } bg-white`}
          disabled={isLoading}
        />

        <a
          className="text-primary-main mb-3 w-max ml-auto text-xs"
          onClick={() => router.push("/admin/signIn?tab=forgot-password")}
        >
          Forgot Password?
        </a>

        <button
          className={`uppercase text-white rounded px-2.5 h-10 drop-shadow-md hover:shadow-md ${
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
            "log in"
          )}
        </button>
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

export default SignInForm;
