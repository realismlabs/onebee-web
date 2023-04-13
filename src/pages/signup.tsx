import Head from "next/head";
import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import router from "next/router";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Mock API call to check if an email address is already registered
  const isEmailRegistered = async (email: string) => {
    // Replace this with your actual API call
    const registeredEmails = ["r@example.com"];
    return registeredEmails.includes(email);
  };

  const isPasswordStrong = (password: string) => {
    // Replace this with your actual logic

    if (password.length < 8) {
      return {
        result: false,
        message: "Password must be at least 8 characters long.",
      };
    } else {
      return { result: true, message: "" };
    }
  };

  // Handle Sign up
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    console.log("Signup submit data:", { email, password });
    // Here you can send the form data to your backend or perform any other necessary action.
    setEmailErrorMessage("");
    setPasswordErrorMessage("");

    if (!email || !password) {
      setEmailErrorMessage("Email and password are required.");
      return;
    }

    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(email)) {
      setEmailErrorMessage("Please enter a valid email address.");
      return;
    }

    if (await isEmailRegistered(email)) {
      setEmailErrorMessage("The email address is already registered.");
      return;
    }

    const is_password_strong = isPasswordStrong(password);
    if (!is_password_strong.result) {
      setPasswordErrorMessage(isPasswordStrong(password).message);
      return;
    }

    // if it passes all tests, re-route to verify screen
    // TODO: Re-route to verify screen only if email is not verified
    router.push("/verify-email");
  };

  return (
    <>
      <Head>
        <title>Dataland</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <main
        className={`overflow-hidden flex h-screen flex-row justify-center items-center min-h-screen bg-slate-1`}
      >
        <div className="w-full flex flex-row flex-grow h-screen">
          <div className="w-full lg:w-1/2 flex justify-center border-r border-slate-3">
            <div className="w-[600px] text-white flex flex-col pt-40 left-0 py-3 gap-2 sm:px-24 px-12 h-screen">
              <header className="fixed top-8">
                <Link href="/">
                  <Image
                    src="/images/logo_darker.svg"
                    width={80}
                    height={32}
                    alt="Dataland logo"
                  ></Image>
                </Link>
              </header>
              <h1 className="text-xl ">Try Dataland for free</h1>
              <h3 className="text-sm text-slate-11">Create a new account</h3>
              <div className="flex flex-col gap-4 mt-8 w-full">
                <div className="w-full flex flex-col gap-2">
                  <button className="w-full bg-slate-3 border border-slate-6 text-white text-sm font-medium rounded-md px-3 py-2 flex flex-row gap-3 hover:border-slate-7 justify-center">
                    <Image
                      src="/images/logo_google.svg"
                      width={24}
                      height={24}
                      alt="Google logo"
                    ></Image>
                    Sign up with Google
                  </button>
                  <button className="w-full bg-slate-3 border border-slate-6 text-white text-sm font-medium rounded-md px-3 py-2 flex flex-row gap-3 hover:border-slate-7 justify-center">
                    <Image
                      src="/images/logo_github.svg"
                      width={24}
                      height={24}
                      alt="Google logo"
                    ></Image>
                    Sign up with GitHub
                  </button>
                </div>
                <div className="flex flex-row items-center justify-center">
                  <hr className="w-full border-1 border-slate-6" />
                  <div className="mx-2 text-slate-11 text-sm">or</div>
                  <hr className="w-full border-1 border-slate-6" />
                </div>
                {/* Write a form input compoennt */}
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="email"
                        className="text-white text-sm font-medium"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        className={`bg-slate-3 hover:border-slate-7 border text-white text-sm font-medium rounded-md px-3 py-2 placeholder-slate-9 ${
                          emailErrorMessage !== ""
                            ? "border-red-9"
                            : "border-slate-6"
                        }
                        focus:outline-none focus:ring-1 focus:ring-blue-600`}
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      {emailErrorMessage && (
                        <div className="text-red-9 text-xs">
                          {emailErrorMessage}
                        </div>
                      )}
                      {/* Add a password field */}
                      <label
                        htmlFor="password"
                        className="text-white text-sm font-medium mt-2"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="•••••••••••••"
                          required
                          className={`w-full bg-slate-3 hover:border-slate-7 border text-white text-sm font-medium rounded-md px-3 py-2 placeholder-slate-9
                          ${
                            passwordErrorMessage !== ""
                              ? "border-red-9"
                              : "border-slate-6"
                          }
                          focus:outline-none focus:ring-1 focus:ring-blue-600
                          }`}
                        />
                        <button
                          className="absolute top-1/2 transform -translate-y-1/2 right-2 px-2 py-1 text-xs text-slate-11  hover:bg-slate-2 rounded-sm"
                          onClick={() => setShowPassword(!showPassword)}
                          type="button"
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                      {passwordErrorMessage && (
                        <div className="text-red-9 text-xs">
                          {passwordErrorMessage}
                        </div>
                      )}
                      <button
                        className="bg-blue-600 text-white text-sm font-medium rounded-md px-4 py-2 mt-2 flex flex-row gap-3 hover:bg-blue-700 justify-center h-10 items-center"
                        type="submit"
                      >
                        Sign up
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <h3 className="text-sm text-slate-11 mt-8 w-full items-center text-center">
                Have an account?{" "}
                <Link
                  href="/login"
                  className="text-blue-500 hover:text-blue-600"
                >
                  {" "}
                  Log in here.
                </Link>
              </h3>
              <div className="flex flex-col flex-grow justify-end text-center">
                <h3 className="text-xs text-slate-9 mb-2">
                  By continuing, you agree to Dataland&apos;s Terms of Service
                  and Privacy Policy, and to receive periodic emails with
                  updates.
                </h3>
              </div>
            </div>
          </div>

          <div
            className="hidden lg:w-1/2 z-30 lg:flex lg:flex-col gap-6 items-center top-96 justify-center bg-center h-screen"
            style={{
              // backgroundImage: "url('/images/signup_render.png')",
              backgroundImage: "url('/images/signup_render.svg')",
            }}
          >
            <div
              className="absolute top-0 right-0 w-1/2 h-screen"
              style={{
                background:
                  "linear-gradient(-30deg, #151718 37.35%, rgba(21, 23, 24, 0) 99.73%)",
              }}
            ></div>

            <div className="absolute top-0 right-0 w-1/2 h-screen bg-gradient-to-b from-[#FFFFFF30]-to-transparent mix-blend-overlay"></div>
            <div className="absolute top-0 right-0 w-1/2 h-screen">
              <div className="flex flex-col flex-grow justify-end items-center pb-32 h-screen gap-4">
                <div className="flex flex-row gap-4 items-center w-[300px]">
                  <div className="p-3 bg-slate-2 border border-slate-6 rounded-md">
                    <Image
                      src="/images/white_lightning_duotone.svg"
                      width={24}
                      height={24}
                      alt="Google logo"
                    ></Image>
                  </div>
                  <p className="text-white">The fastest data browsing UX</p>
                </div>
                <div className="flex flex-row gap-4 items-center w-[300px]">
                  <div className="p-3 bg-slate-2 border border-slate-6 rounded-md">
                    <Image
                      src="/images/white_shield_check_duotone.svg"
                      width={24}
                      height={24}
                      alt="Google logo"
                    ></Image>
                  </div>
                  <p className="text-white">Secure & SOC 2 compliant</p>
                </div>
                <div className="flex flex-row gap-4 items-center w-[300px]">
                  <div className="p-3 bg-slate-2 border border-slate-6 rounded-md">
                    <Image
                      src="/images/white_fast_forward_duotone.svg"
                      width={24}
                      height={24}
                      alt="Google logo"
                    ></Image>
                  </div>
                  <p className="text-white">Set up in 45 seconds</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
