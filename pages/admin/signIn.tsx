import React, { Fragment, useState } from "react";
import img from "../../assets/img/sign-in-img.png";
import Image from "next/image";
import Logo from "../../components/partials/Logo";
import pattern3 from "../../assets/img/pattern-3.png";
import useAuthState from "../../hooks/useAuthState";
import Input from "../../components/partials/Input";
import { setCookies } from "cookies-next";
import { useRouter } from "next/router";
import LoadingComponent from "../../components/partials/Loading/LoadingComponent";
import toast, { Toaster } from "react-hot-toast";

const SignIn = () => {
  const router = useRouter();
  const { signInForm, handleSignInForm, postSignInForm } = useAuthState();
  const notifyError = (err: string) => toast.error(err);

  const [isLoading, setIsLoading] = useState(false);

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
    <section className="min-h-screen flex relative w-full">
      {!isLoading ? (
        <Fragment>
          <div className="max-w-5xl m-auto w-full">
            {/* logo */}
            <div className="m-auto w-max mb-7">
              <Logo className="w-85 h-27.5" />
            </div>

            {/* form container */}
            <div className="bg-screen p-15 flex items-center justify-between w-full rounded-2xl">
              {/* form */}
              <form
                className="text-dark font-semibold flex flex-col"
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
                    signInForm.password.error.length === 0 ? "mb-5" : "mb-10"
                  } bg-white`}
                  disabled={isLoading}
                />

                <a className="text-primary-main mb-3 w-max ml-auto text-xs">
                  Forgot Password?
                </a>

                {/* checkbox */}
                <div className="mb-5 flex w-max items-center">
                  <input
                    id="checkbox"
                    type="checkbox"
                    className="mr-3 h-5 w-5 input"
                    // checked={isChecked}
                    // onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    //   setIsChecked(e.target.checked);
                    // }}
                  />
                  <label
                    htmlFor="checkbox"
                    className="cursor-pointer text-sm font-normal outline-none capitalize text-active"
                  >
                    if sum dolor sit amet, consectetur adipiscing elit, sed.
                  </label>
                </div>

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
                  log in
                </button>
              </form>

              <div className="h-67.5 w-1 border-l border-gray-400" />

              {/* image */}
              <div className="w-67.5 h-45">
                <Image src={img} alt="img" />
              </div>
            </div>
          </div>

          {/* pattern images  */}
          <div className="absolute top-0 right-0">
            <Image src={pattern3} alt="pattern3" />
          </div>

          <div className="absolute bottom-0 left-0 rotate-180">
            <Image src={pattern3} alt="pattern3" />
          </div>
        </Fragment>
      ) : (
        <div className="m-auto">
          <LoadingComponent
            loadingSpinnerClassName="w-8 h-8"
            message="Signing In..."
            textFont="text-xl"
          />
        </div>
      )}
      <Toaster position="top-right" reverseOrder={false} />
    </section>
  );
};

export default SignIn;
