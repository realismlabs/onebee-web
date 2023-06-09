import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSignIn } from "@clerk/nextjs";
import { CircleNotch } from "@phosphor-icons/react";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { getWorkspaceDetails } from "@/utils/api";

export default function Login() {
  const router = useRouter();
  const url = router.asPath;

  function extractWorkspaceId(url: string): string | null {
    const match = url.match(/%2Fworkspace%2F(\d+)%2F?/);
    return match ? match[1] : null;
  }

  const isWorkspaceRedirectUrl = url?.includes("workspace");
  const workspaceId = isWorkspaceRedirectUrl ? extractWorkspaceId(url) : null;

  console.log("workspaceId", workspaceId);

  // http://localhost:3000/login#/?redirect_url=%2Fworkspace%2F6
  // parse out the workspaceId from ater the redirectUrl=

  const {
    data: workspaceDetail,
    isLoading: isWorkspaceDetailsLoading,
    isError: isWorkspaceDetailsError,
  } = useQuery({
    queryKey: ["workspaceDetail", workspaceId],
    queryFn: async () => {
      const response = await getWorkspaceDetails(workspaceId);
      return response;
    },
    enabled: !!workspaceId,
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // for clerk
  const { isLoaded: isLoadedSignIn, signIn, setActive } = useSignIn();

  const { isSignedIn, isLoaded: isLoadedUser } = useUser();
  if (!isSignedIn) {
  } else {
    // If user is already logged in, redirect to dashboard
    router.push("/dashboard");
  }

  // Handle login - this is cursed code, will def need to handle properly
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsLoggingIn(true);
    setErrorMessage("");
    if (!email || !password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    const emailRegex =
      /^[\w-]+(\.[\w-]+)*(\+[a-zA-Z0-9-_.+]+)?@([\w-]+\.)+[a-zA-Z]{2,7}$/;

    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      setIsLoggingIn(false);
      return;
    }

    if (!isLoadedSignIn) {
      setIsLoggingIn(false);
      return;
    }

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        console.log(result);
        await setActive({ session: result.createdSessionId });
        // Clerk handles the redirect after sign-in to /dashboard - check .env.local or Clerk dashboard for prod
        router.push("/dashboard");
        setIsLoggingIn(false);
      } else {
        /*Investigate why the login hasn't completed */
        console.log(result);
        setIsLoggingIn(false);
      }
    } catch (err: any) {
      setIsLoggingIn(false);
      console.error("error", err.errors[0].longMessage);
      setErrorMessage(err.errors[0].longMessage);
    }
  };

  const handleGoogleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await signIn
        ?.authenticateWithRedirect({
          strategy: "oauth_google",
          redirectUrl: "/sso-callback",
          redirectUrlComplete: "/dashboard",
        })
        .catch((err: any) => {
          console.error(JSON.stringify(err, null, 2));
        });
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (isLoadedUser && !isSignedIn) {
    return (
      <>
        <Head>
          <title>Dataland | Log in</title>
          <meta name="description" content="Log in to Dataland" />
        </Head>
        <main
          className={`overflow-hidden flex h-screen flex-row justify-center items-center min-h-screen bg-slate-1`}
        >
          <div className="w-full flex flex-row flex-grow h-screen">
            <div className="w-full flex justify-center border-r border-slate-3">
              <div className="w-[600px] text-slate-12 flex flex-col left-0 py-3 gap-2 sm:px-24 px-12 h-screen">
                <header className="fixed top-8">
                  <Link href="/" tabIndex={-1}>
                    <Image
                      src="/images/logo_darker_v2.svg"
                      width={100}
                      height={40}
                      alt="Dataland logo"
                    ></Image>
                  </Link>
                </header>
                {isWorkspaceRedirectUrl && !workspaceDetail && (
                  <div className="text-amber-9 px-4 py-2 rounded-md bg-amber-3 text-[14px] items-center truncate mt-24">
                    You must be logged in to access this workspace.
                  </div>
                )}
                {isWorkspaceRedirectUrl && workspaceDetail && (
                  <div className="text-amber-9 px-4 py-2 rounded-md bg-amber-3 text-[14px] items-center mt-24">
                    You must be logged in to access the{" "}
                    <span className="font-semibold inline">
                      {workspaceDetail.name}
                    </span>{" "}
                    workspace
                  </div>
                )}
                <h1
                  className={`text-xl ${
                    !isWorkspaceRedirectUrl ? "mt-32" : "mt-8"
                  }`}
                >
                  Welcome back
                </h1>
                <h3 className="text-[14px] text-slate-11">Log into Dataland</h3>
                <div className="flex flex-col gap-4 mt-8 w-full">
                  <div className="w-full flex flex-col gap-2">
                    <button
                      className="w-full bg-slate-3 border border-slate-6 text-slate-12 text-[14px] font-medium rounded-md px-3 py-2 flex flex-row gap-3 hover:bg-slate-4 justify-center"
                      onClick={(e) => handleGoogleSubmit(e)}
                    >
                      <Image
                        src="/images/logo_google.svg"
                        width={24}
                        height={24}
                        alt="Google logo"
                      ></Image>
                      Log in with Google
                    </button>
                    {/* <button className="w-full bg-slate-3 border border-slate-6 text-slate-12 text-[14px] font-medium rounded-md px-3 py-2 flex flex-row gap-3 hover:bg-slate-4 justify-center">
                      <Image
                        src="/images/logo_github.svg"
                        width={24}
                        height={24}
                        alt="Google logo"
                      ></Image>
                      Log in with GitHub
                    </button> */}
                  </div>
                  <div className="flex flex-row items-center justify-center">
                    <hr className="w-full border-1 border-slate-6" />
                    <div className="mx-2 text-slate-11 text-[14px]">or</div>
                    <hr className="w-full border-1 border-slate-6" />
                  </div>
                  {/* Write a form input compoennt */}
                  <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="email"
                          className="text-slate-12 text-[14px] font-medium"
                        >
                          Email
                        </label>
                        <input
                          id="email"
                          className={`bg-slate-3 hover:border-slate-7 border text-slate-12 text-[14px] font-medium rounded-md px-3 py-2 placeholder-slate-9 
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
                            className="text-slate-12 text-[14px] font-medium flex-grow"
                          >
                            Password
                          </label>
                          <Link
                            href="/forgot-password"
                            className="text-slate-10 text-[13px] hover:text-slate-11"
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
                            className={`w-full bg-slate-3 hover:border-slate-7 border  text-slate-12 text-[14px] font-medium rounded-md px-3 py-2 placeholder-slate-9
                          ${
                            errorMessage !== ""
                              ? "border-red-9"
                              : "border-slate-6"
                          } 
                          focus:outline-none focus:ring-1 focus:ring-blue-600
                          `}
                          />
                          <button
                            className="absolute top-1/2 transform -translate-y-1/2 right-2 px-2 py-1 text-[13px] text-slate-11  hover:bg-slate-2 rounded-sm"
                            onClick={() => setShowPassword(!showPassword)}
                            type="button"
                            tabIndex={-1}
                          >
                            {showPassword ? "Hide" : "Show"}
                          </button>
                        </div>

                        {errorMessage && (
                          <div className="text-red-9 mt-2 text-[13px] ">
                            {errorMessage}
                          </div>
                        )}

                        <button
                          className={`bg-blue-600 text-slate-12 text-[14px] font-medium rounded-md px-4 py-2 mt-2 flex flex-row gap-3 hover:bg-blue-700 justify-center h-10 items-center
                        ${isLoggingIn ? "opacity-50 pointer-events-none" : ""}
                        `}
                          type="submit"
                        >
                          {isLoggingIn ? (
                            <div className="animate-spin">
                              <CircleNotch className="h-5 w-5 text-white" />
                            </div>
                          ) : (
                            "Log in"
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                <h3 className="text-[14px] text-slate-11 mt-8 w-full items-center text-center">
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
  return (
    <>
      <Head>
        <title>Dataland | Log in</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <div className="h-screen w-full bg-slate-1"></div>
    </>
  );
}
