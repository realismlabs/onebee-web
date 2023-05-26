import React, {
  SyntheticEvent,
  useState,
  useEffect,
  createRef,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import { useSignIn, useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import { CircleNotch, CheckCircle } from "@phosphor-icons/react";
import { set } from "date-fns";

const SignInPage: NextPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [complete, setComplete] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);

  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn, isLoaded: isLoadedUser } = useUser();

  //----------------------------------------------------------------
  const [code, setCode] = useState<Array<string>>(Array(6).fill(""));
  const inputs = Array(6)
    .fill(0)
    .map(() => createRef<HTMLInputElement>());

  const handleChange = (e: ChangeEvent<HTMLInputElement>, i: number) => {
    const newCode = [...code];
    newCode[i] = e.target.value;
    setCode(newCode);

    if (i < code.length - 1 && e.target.value) {
      inputs[i + 1].current?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, i: number) => {
    if (e.key === "Backspace" && code[i] === "" && i > 0) {
      inputs[i - 1].current?.focus();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    i: number
  ) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain");
    if (pastedData.length > 6 - i || !/^\d*$/.test(pastedData)) return;
    const newCode = [...code];
    for (let j = 0; j < pastedData.length; j++) {
      newCode[i + j] = pastedData[j];
    }
    setCode(newCode);

    inputs[i + pastedData.length - 1].current?.focus();
  };

  //----------------------------------------------------------------

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
  } else {
    // If user is already logged in, redirect to dashboard
    router.push("/dashboard");
  }

  async function create(e: SyntheticEvent) {
    e.preventDefault();
    await signIn
      ?.create({
        //@ts-ignore - clerk's types are wrong
        strategy: "reset_password_email_code",
        identifier: email,
      })
      .then((_) => {
        setSuccessfulCreation(true);
      })
      .catch((err) => {
        console.error("error", err.errors[0].longMessage);
        setErrorMessage(err.errors[0].longMessage);
      });
  }

  async function reset(e: SyntheticEvent) {
    e.preventDefault();
    await signIn
      ?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: code.join(""),
        //@ts-ignore - clerk's types are wrong
        password,
      })
      .then((result) => {
        if (result.status === "needs_second_factor") {
          setSecondFactor(true);
        } else if (result.status === "complete") {
          setActive({ session: result.createdSessionId });
          setComplete(true);
        } else {
          console.log(result);
        }
      })
      .catch((err) => {
        console.error("error", err.errors[0].longMessage);
        setErrorMessage(err.errors[0].longMessage);
      });
  }

  return (
    <>
      <Head>
        <title>Dataland | Forgot password?</title>
      </Head>
      <main
        className={`overflow-hidden flex h-screen flex-row justify-center items-center min-h-screen bg-slate-1`}
      >
        <div className="w-full flex flex-row flex-grow h-screen">
          <div className="w-full flex justify-center border-r border-slate-3">
            <div className="w-[600px] text-slate-12 flex flex-col pt-40 left-0 py-3 gap-2 sm:px-24 px-12 h-screen">
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
              <h1 className="text-xl ">Forgot your password?</h1>
              <div className="flex flex-col gap-4 mt-8 w-full">
                {/* Write a form input compoennt */}
                <form onSubmit={!successfulCreation ? create : reset}>
                  <div className="flex flex-col gap-2">
                    {!successfulCreation && !complete && (
                      <>
                        <label
                          htmlFor="email"
                          className="text-slate-12 text-[14px] font-medium"
                        >
                          Email
                        </label>
                        <input
                          id="email"
                          className={`bg-slate-3 hover:border-slate-7 border border-slate-6 text-slate-12 text-[14px] font-medium rounded-md px-3 py-2 placeholder-slate-9 ${
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
                          className={`bg-blue-600 text-slate-12 text-[14px] font-medium rounded-md px-4 py-2 flex flex-row gap-3 hover:bg-blue-700 justify-center h-10 items-center mt-4`}
                        >
                          Continue
                        </button>
                      </>
                    )}

                    {successfulCreation && !complete && (
                      <>
                        {/* <h3 className="text-[14px] bg-blue-2 text-blue-9 py-2 px-3 self-start rounded-md">
                          Check your inbox for a verification code
                        </h3> */}
                        <div className="space-y-1 flex flex-col">
                          <label
                            htmlFor="password"
                            className="text-slate-12 text-[14px] font-medium"
                          >
                            Verification code
                          </label>
                          <label className="text-slate-11 text-[13px]">
                            Check your inbox for a verification code
                          </label>
                        </div>
                        <div className="flex space-x-2">
                          {code.map((c, i) => (
                            <input
                              title="Reset code"
                              key={i}
                              type="text"
                              required
                              ref={inputs[i]}
                              value={c}
                              onChange={(e) => handleChange(e, i)}
                              onKeyDown={(e) => handleKeyDown(e, i)}
                              onPaste={(e) => handlePaste(e, i)}
                              maxLength={1}
                              className={`bg-slate-3 hover:border-slate-7 border border-slate-6 text-slate-12 text-[14px] font-medium rounded-md w-[36px] placeholder-slate-9 flex items-center justify-center  text-center ${
                                errorMessage && "border-red-9"
                              }`}
                            />
                          ))}
                        </div>
                        <label
                          htmlFor="password"
                          className="text-slate-12 text-[14px] font-medium mt-4"
                        >
                          New password
                        </label>
                        <input
                          type="password"
                          title="Password"
                          value={password}
                          required
                          onChange={(e) => setPassword(e.target.value)}
                          className={`bg-slate-3 hover:border-slate-7 border border-slate-6 text-slate-12 text-[14px] font-medium rounded-md px-3 py-2 placeholder-slate-9 ${
                            errorMessage && "border-red-9"
                          }
                        focus:outline-none focus:ring-1 focus:ring-blue-600`}
                        />

                        <button
                          className={`bg-blue-600 text-slate-12 text-[14px] font-medium rounded-md px-4 py-2 flex flex-row gap-3 hover:bg-blue-700 justify-center h-10 items-center mt-4`}
                        >
                          Reset
                        </button>
                        {errorMessage && (
                          <div className="text-red-9 text-[13px]">
                            {errorMessage}
                          </div>
                        )}
                      </>
                    )}

                    {complete && (
                      <div className="text-green-9 bg-green-2 text-[14px] px-3 py-2 self-start flex flex-row gap-2">
                        <CheckCircle
                          size={20}
                          weight="fill"
                          className="text-green-500"
                        />
                        <p>Success! Redirecting you to Dataland..</p>
                      </div>
                    )}
                    {secondFactor &&
                      "2FA error, please email support@dataland.io for assistance."}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default SignInPage;
