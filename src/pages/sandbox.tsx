import Head from "next/head";
import React, { useState } from "react";
import Link from "next/link";
import LoaderAnimation from "../components/LoaderAnimation";

export default function Sandbox() {
  return (
    <>
      <Head>
        <title>Dataland 1B: Sandbox</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <main
        className={`overflow-hidden flex h-screen flex-col justify-center items-center min-h-screen bg-slate-1`}
      >
        <div className="bg-blue-900/50 flex justify-center items-center py-1.5 w-full mx-auto gap-2">
          <div className="text-blue-400 text-sm">
            This playground loads 1.6 billion rows of Hacker News data.
          </div>
          <Link href="/signup" className="text-white text-sm">
            Try with your data →
          </Link>
        </div>
        <div className="w-full flex flex-row flex-grow">
          <div className="w-12 text-white flex flex-col items-center left-0 border-r border-slate-6 py-3 gap-2">
            <div className="h-7 w-7 bg-slate-4 rounded-sm text-slate-11 flex items-center justify-center">
              A
            </div>
            <div className="flex-grow"></div>
            <div className="h-7 w-7 bg-slate-4 rounded-sm text-slate-11 flex items-center justify-center">
              A
            </div>
          </div>
        </div>
        <div className="absolute z-30 flex flex-col gap-6 items-center top-96 justify-center">
          <LoaderAnimation />
          <div>
            <h1 className="text-slate-9">Loading rows..</h1>
          </div>
        </div>
      </main>
    </>
  );
}
