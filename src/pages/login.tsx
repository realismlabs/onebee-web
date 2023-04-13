import Head from "next/head";
import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import router, { Router } from "next/router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const registeredEmails = [
    {
      email: "unverified@example.com",
      password: "password",
      verified: false,
    },
    { email: "verified@example.com", password: "password", verified: true },
  ];

  // Mock API call to see if email and password are correct
  const isEmailAndPasswordRegistered = async (
    email: string,
    password: string,
    registeredEmails: any
  ) => {
    // Replace this with your actual API call

    return registeredEmails.some(
      (user: any) => user.email === email && user.password === password
    );
  };

  const isEmailAndPasswordVerified = async (
    email: string,
    password: string,
    registeredEmails: any
  ) => {
    // Replace this with your actual API call
    return registeredEmails.some(
      (user: any) =>
        user.email === email && user.password === password && user.verified
    );
  };

  // Handle Sign up
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    console.log("Signup submit data:", { email, password });
    // Here you can send the form data to your backend or perform any other necessary action.
    setErrorMessage("");
    if (!email || !password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (
      !(await isEmailAndPasswordRegistered(email, password, registeredEmails))
    ) {
      setErrorMessage("The email or password is incorrect.");
      return;
    }

    if (
      !(await isEmailAndPasswordVerified(email, password, registeredEmails))
    ) {
      router.push("/verify-email");
    } else {
      router.push("/dashboard");
    }
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
          <div className="w-full flex justify-center border-r border-slate-3">
            <div className="w-[600px] text-white flex flex-col pt-40 left-0 py-3 gap-2 sm:px-24 px-12 h-screen">
              <header className="fixed top-8">
                <Link href="/" tabIndex={-1}>
                  <Image
                    src="/images/logo_darker.svg"
                    width={80}
                    height={32}
                    alt="Dataland logo"
                  ></Image>
                </Link>
              </header>
              <h1 className="text-xl ">Welcome back</h1>
              <h3 className="text-sm text-slate-11">Log into Dataland</h3>
              <div className="flex flex-col gap-4 mt-8 w-full">
                <div className="w-full flex flex-col gap-2">
                  <button className="w-full bg-slate-3 border border-slate-6 text-white text-sm font-medium rounded-md px-3 py-2 flex flex-row gap-3 hover:border-slate-7 justify-center">
                    <Image
                      src="/images/logo_google.svg"
                      width={24}
                      height={24}
                      alt="Google logo"
                    ></Image>
                    Log in with Google
                  </button>
                  <button className="w-full bg-slate-3 border border-slate-6 text-white text-sm font-medium rounded-md px-3 py-2 flex flex-row gap-3 hover:border-slate-7 justify-center">
                    <Image
                      src="/images/logo_github.svg"
                      width={24}
                      height={24}
                      alt="Google logo"
                    ></Image>
                    Log in with GitHub
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
                        className={`bg-slate-3 hover:border-slate-7 border text-white text-sm font-medium rounded-md px-3 py-2 placeholder-slate-9 
                        ${
                          errorMessage !== ""
                            ? "border-red-9"
                            : "border-slate-6"
                        } 
                        focus:outline-none focus:ring-1 focus:ring-blue-600`}
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      {/* Add a password field */}
                      <div className="mt-2 flex flex-row items-center">
                        <label
                          htmlFor="password"
                          className="text-white text-sm font-medium flex-grow"
                        >
                          Password
                        </label>
                        <Link
                          href="/forgot-password"
                          className="text-slate-10 text-xs hover:text-slate-11"
                          tabIndex={-1}
                        >
                          {" "}
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="•••••••••••••"
                          required
                          className={`w-full bg-slate-3 hover:border-slate-7 border  text-white text-sm font-medium rounded-md px-3 py-2 placeholder-slate-9
                          ${
                            errorMessage !== ""
                              ? "border-red-9"
                              : "border-slate-6"
                          } 
                          focus:outline-none focus:ring-1 focus:ring-blue-600
                          `}
                        />
                        <button
                          className="absolute top-1/2 transform -translate-y-1/2 right-2 px-2 py-1 text-xs text-slate-11  hover:bg-slate-2 rounded-sm"
                          onClick={() => setShowPassword(!showPassword)}
                          type="button"
                          tabIndex={-1}
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>

                      {errorMessage && (
                        <div className="text-red-9 mt-2 text-xs ">
                          {errorMessage}
                        </div>
                      )}

                      <button
                        className="bg-blue-600 text-white text-sm font-medium rounded-md px-4 py-2 mt-2 flex flex-row gap-3 hover:bg-blue-700 justify-center h-10 items-center"
                        type="submit"
                      >
                        Log in
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <h3 className="text-sm text-slate-11 mt-8 w-full items-center text-center">
                Don&apos;t have an account yet?{" "}
                <Link
                  href="/signup"
                  className="text-blue-500 hover:text-blue-600"
                >
                  Sign up here.
                </Link>
              </h3>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
