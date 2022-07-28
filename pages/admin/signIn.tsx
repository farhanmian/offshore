import React, { Fragment, useState } from "react";
import Image from "next/image";
import Logo from "../../components/partials/Logo";
import pattern3 from "../../assets/img/pattern-3.png";
import useAuthState from "../../hooks/useAuthState";
import Input from "../../components/partials/Input";
import { setCookies } from "cookies-next";
import { useRouter } from "next/router";
import LoadingComponent from "../../components/partials/Loading/LoadingComponent";
import toast, { Toaster } from "react-hot-toast";
import SignInForm from "../../components/SignInForm";
import ForgotPassword from "../../components/ForgotPassword";
import ResetPassword from "../../components/ResetPassword";

const SignIn = () => {
  const router = useRouter();
  const tab = `${router.query.tab}`;
  console.log("tab", router);

  return (
    <section className="min-h-screen flex relative w-full">
      <div className="max-w-5xl m-auto w-full">
        {/* logo */}
        <div className="m-auto w-max mb-7">
          <Logo className="w-85 h-27.5" />
        </div>

        {/* form container */}
        {tab === "forgot-password" ? <ForgotPassword /> : <SignInForm />}
        {/* <ResetPassword /> */}
      </div>
      {/* pattern images  */}
      <div className="absolute top-0 right-0">
        <Image src={pattern3} alt="pattern3" />
      </div>
      <div className="absolute bottom-0 left-0 rotate-180">
        <Image src={pattern3} alt="pattern3" />
      </div>

      <Toaster position="top-right" reverseOrder={false} />
    </section>
  );
};

export default SignIn;
