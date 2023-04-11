import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import React, { useState } from "react";
import Link from "next/link";
import LoaderAnimation from "../components/LoaderAnimation";

const inter = Inter({ subsets: ["latin"] });

export default function Sandbox() {
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
            <div className="w-[600px] text-white flex flex-col items-start justify-center left-0 py-3 gap-2 sm:px-24 px-12 h-screen">
              <div className="flex flex-col flex-grow justify-end text-center">
                <h3 className="text-xs text-slate-9"></h3>
              </div>
              <h1 className="text-xl ">Try Dataland for free</h1>
              <h3 className="text-sm text-slate-11">Create a new account</h3>
              <div className="flex flex-col gap-4 mt-8 w-full">
                <div className="w-full flex flex-col gap-2">
                  <button className="w-full bg-slate-3 border border-slate-6 text-white text-sm font-medium rounded-md px-4 py-2 flex flex-row gap-3 hover:bg-slate-4 justify-center">
                    <Image
                      src="/images/logo_google.svg"
                      width={24}
                      height={24}
                      alt="Google logo"
                    ></Image>
                    Sign up with Google
                  </button>
                  <button className="w-full bg-slate-3 border border-slate-6 text-white text-sm font-medium rounded-md px-4 py-2 flex flex-row gap-3 hover:bg-slate-4 justify-center">
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
                      className="bg-slate-3 hover:bg-slate-4 border border-slate-6 text-white text-sm font-medium rounded-md px-4 py-2 placeholder-slate-9"
                      type="email"
                      placeholder="you@company.com"
                    />
                    {/* Add a password field */}
                    <label
                      htmlFor="password"
                      className="text-white text-sm font-medium mt-2"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      className="bg-slate-3 hover:bg-slate-4 border border-slate-6 text-white text-sm font-medium rounded-md px-4 py-2 placeholder-slate-9"
                      type="password"
                      placeholder="•••••••••••••"
                    />
                  </div>
                </div>
                <button className="bg-blue-600 text-white text-sm font-medium rounded-md px-4 py-2 flex flex-row gap-3 hover:bg-blue-700 justify-center h-10 items-center">
                  Sign up
                </button>
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
