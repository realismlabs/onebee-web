import Head from "next/head";
import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import { CircleNotch, CheckCircle } from "@phosphor-icons/react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); // Add this line
  const [emailSent, setEmailSent] = useState(false); // Add this line

  const sendEmailWithDelay = async (email: string) => {
    await Promise.all([
      new Promise<void>((resolve) => {
        setTimeout(() => {
          setLoading(false); // Set loading back to false after the delay
          resolve();
        }, 1500);
      }),
      new Promise<void>((resolve) => {
        // Call mock API to send email here
        console.log("Email sent to", email);
        resolve();
      }),
    ]);
    setEmailSent(true); // Set emailSent to true after both Promises have resolved
  };

  // Handle Sign up
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    console.log("Password reset data:", { email });
    // Here you can send the form data to your backend or perform any other necessary action.
    setEmailSent(false); // Reset emailSent to false
    setErrorMessage("");
    if (!email) {
      setErrorMessage("Email is required.");
      return;
    }

    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true); // Set loading to true before the delay
    await sendEmailWithDelay(email);
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
                <Link href="/">
                  <Image
                    src="/images/logo_darker.svg"
                    width={80}
                    height={32}
                    alt="Dataland logo"
                  ></Image>
                </Link>
              </header>
              <h1 className="text-xl ">Forgot your password?</h1>
              <h3 className="text-[14px] text-slate-11">
                We&apos;ll email you a link to reset your password.
              </h3>
              <div className="flex flex-col gap-4 mt-8 w-full">
                {/* Write a form input compoennt */}
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="email"
                      className="text-white text-[14px] font-medium"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      className={`bg-slate-3 hover:border-slate-7 border border-slate-6 text-white text-[14px] font-medium rounded-md px-3 py-2 placeholder-slate-9 ${
                        errorMessage && "border-red-9"
                      }
                      focus:outline-none focus:ring-1 focus:ring-blue-600`}
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {errorMessage && (
                      <div className="text-red-9 text-[13px]">
                        {errorMessage}
                      </div>
                    )}
                    <button
                      className={`bg-blue-600 text-white text-[14px] font-medium rounded-md px-4 py-2 flex flex-row gap-3 hover:bg-blue-700 justify-center h-10 items-center mt-4
                      ${loading ? "opacity-50" : ""}`}
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="animate-spin">
                          <CircleNotch width={20} height={20} />
                        </span>
                      ) : (
                        "Send reset email"
                      )}
                    </button>
                    {emailSent && (
                      <div className="text-green-9 mt-2 text-[13px] p-4 flex flex-row gap-2 bg-slate-2 border border-slate-4 items-center rounded-md">
                        <CheckCircle
                          size={20}
                          weight="fill"
                          className="text-green-500"
                        />
                        <p>
                          {" "}
                          Sent! Check your inbox for the password reset email.{" "}
                        </p>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
