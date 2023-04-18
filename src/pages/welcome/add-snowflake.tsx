import React, { useState, useEffect, FC } from "react";
import Link from "next/link";
import { useUser } from "../../components/UserContext";
import useCopyToClipboard from "../../components/useCopyToClipboard";
import router from "next/router";
import Image from "next/image";
import { CaretLeft, CopySimple, Check } from "@phosphor-icons/react";
import { Switch } from "@headlessui/react";
import useMeasure from "react-use-measure";
import WordTooltipDemo from "../../components/WordTooltipDemo";

interface AccountHeaderProps {
  email: string;
}

const AccountHeader: React.FC<AccountHeaderProps> = ({ email }) => {
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
    router.push("/login?lo=true");
  };

  return (
    <div className="w-full flex flex-row h-16 items-center p-12 bg-slate-1">
      <div className="flex flex-col grow items-start">
        <p className="text-xs text-slate-11 mb-1">Logged in as:</p>
        <p className="text-xs text-white font-medium">{email}</p>
      </div>
      <div className="flex flex-col grow items-end">
        <p
          className="text-xs text-white hover:text-slate-12 font-medium cursor-pointer"
          onClick={handleLogout}
        >
          Logout
        </p>
      </div>
    </div>
  );
};

type IPProps = {
  ip: string;
};

const CopyableIP: FC<IPProps> = ({ ip }) => {
  const { isCopied, handleCopy } = useCopyToClipboard();

  return (
    <div
      className="flex flex-row gap-1 relative cursor-pointer"
      onClick={() => handleCopy(ip)}
    >
      <CopySimple size={16} weight="bold" className="text-slate-11" />
      <p>{ip}</p>
      {isCopied && (
        <div className="absolute top-6 px-2 py-1 text-white bg-black rounded flex flex-row items-center gap-1">
          <Check size={12} weight="bold" className="text-green-500" />
          Copied!
        </div>
      )}
    </div>
  );
};

export default function AddSnowflake() {
  const { user } = useUser();
  const email = user?.email ?? "placeholder@example.com";
  let [snowflake_custom_host, setSnowflakeCustomHost] = useState(false);
  let [snowflake_auth_method, setSnowflakeAuthMethod] = useState("user_pass");
  let [snowflakeAuthRef, snowflakeAuthBounds] = useMeasure();
  let transition = { type: "ease", ease: "easeInOut", duration: 0.4 };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("clicked");
  };

  return (
    <div className="h-screen bg-slate-1">
      <AccountHeader email={email ?? "placeholder@example.com"} />
      <div className="flex flex-col mx-auto w-[600px]  text-white gap-2">
        <Link href="/welcome/add-data-source">
          <div className="flex flex-row items-center gap-2 text-xs text-slate-11">
            <CaretLeft size={16} weight="bold" />
            <p>Back to sources</p>
          </div>
        </Link>
        <div className="flex flex-row items-center gap-4 mt-4">
          <p className="flex-grow text-md">Set up Snowflake connection</p>
          <Link href="/" className="text-xs px-3 py-2 bg-slate-3 rounded-md">
            Snowflake docs
          </Link>
        </div>
        <form>
          <div className="flex flex-row w-full items-center mt-4 gap-4">
            <label className="text-xs w-[100px]">
              <WordTooltipDemo
                display_text={"Account"}
                tooltip_content={
                  <div className="max-w-[280px] space-y-2">
                    <p>
                      This can be found in the Snowflake URL, ex:&nbsp;
                      <span className="bg-blue-900/40 px-1 py-0.5 rounded-md font-mono text-blue-400">
                        account_name
                      </span>
                      .snowflakecomputing.com.
                    </p>
                    <p>
                      If connecting via a proxy, click the proxy toggle, and
                      specify the full proxy address.
                    </p>
                  </div>
                }
              />
            </label>
            <div className="flex flex-row items-center flex-grow">
              {snowflake_custom_host ? (
                <>
                  <input
                    className="rounded-l block w-full bg-slate-3 text-white text-xs py-2 px-3 border border-slate-6 hover:border-slate-7 focus:outline-none focus:ring-1 focus:ring-blue-600 z-20 placeholder-slate-10"
                    required
                    placeholder="Full proxy address"
                  />
                </>
              ) : (
                <>
                  <input
                    className="rounded-l block w-full bg-slate-3 text-white text-xs py-2 px-3 border border-slate-6 hover:border-slate-7 focus:outline-none focus:ring-1 focus:ring-blue-600 z-20 placeholder-slate-10"
                    required
                    placeholder="account_name"
                  />
                  <div className="rounded-r block bg-slate-6 text-white border-t border-r border-b border-slate-6 text-xs py-2 px-3 ">
                    .snowflakecomputing.com
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-row gap-2 items-center">
              <label className="text-xs">Proxy?</label>
              <Switch
                checked={snowflake_custom_host}
                onChange={setSnowflakeCustomHost}
                className={`${
                  snowflake_custom_host ? "bg-blue-600" : "bg-slate-6"
                } relative inline-flex h-6 w-11 items-center rounded-full overflow-hidden`}
              >
                <span
                  className={`${
                    snowflake_custom_host ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>
          </div>
          <div className="flex flex-row items-center mt-4 gap-4">
            <label className="text-xs w-[100px]">Warehouse</label>
            <div className="flex flex-row items-center flex-grow">
              <input
                className="rounded-md block w-full bg-slate-3 text-white text-xs py-2 px-3 border border-slate-6 hover:border-slate-7 focus:outline-none focus:ring-1 focus:ring-blue-600 z-20 placeholder-slate-10"
                required
                placeholder="i.e. COMPUTE_WH"
              />
            </div>
          </div>
          <div className="flex flex-row items-center mt-4 gap-4">
            <label className="text-xs w-[100px]">Auth method</label>
            <select
              title="Auth method"
              className="flex-grow rounded-md block bg-slate-3 text-white text-xs py-2 px-3 border border-slate-6 hover:border-slate-7 focus:outline-none focus:ring-1 focus:ring-blue-600"
              onChange={(e) => setSnowflakeAuthMethod(e.target.value)}
            >
              <option value="user_pass">Username / password</option>
              <option value="key_value">Key / value pair</option>
            </select>
          </div>
          <div ref={snowflakeAuthRef}>
            {snowflake_auth_method === "user_pass" ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-row items-center mt-4 gap-4">
                  <label className="text-xs w-[100px]">Username</label>
                  <input
                    className="flex-grow rounded-md block bg-slate-3 text-white text-xs py-2 px-3 border border-slate-6 hover:border-slate-7 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-slate-10"
                    required
                    placeholder=""
                    title="Username"
                  />
                </div>
                <div className="flex flex-row items-center gap-4">
                  <label className="text-xs w-[100px]">Password</label>
                  <input
                    className="flex-grow rounded-md block bg-slate-3 text-white text-xs py-2 px-3 border border-slate-6 hover:border-slate-7 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-slate-10"
                    required
                    placeholder=""
                    title="Password"
                  />
                </div>
              </div>
            ) : (
              <div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-row items-center mt-4 gap-4">
                    <label className="text-xs w-[100px]">Key</label>
                    <input
                      className="flex-grow rounded-md block bg-slate-3 text-white text-xs py-2 px-3 border border-slate-6 hover:border-slate-7 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-slate-10"
                      required
                      placeholder=""
                      title="Key"
                    />
                  </div>
                  <div className="flex flex-row items-center gap-4">
                    <label className="text-xs w-[100px]">Value</label>
                    <input
                      className="flex-grow rounded-md block bg-slate-3 text-white text-xs py-2 px-3 border border-slate-6 hover:border-slate-7 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-slate-10"
                      required
                      placeholder=""
                      title="Value"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-row items-center mt-4 gap-4">
            <label className="text-xs w-[100px]">Role (optional)</label>
            <div className="flex flex-row items-center flex-grow">
              <input
                className="rounded-md block w-full bg-slate-3 text-white text-xs py-2 px-3 border border-slate-6 hover:border-slate-7 focus:outline-none focus:ring-1 focus:ring-blue-600 z-20 placeholder-slate-10"
                required
                placeholder="i.e. ACCOUNTADMIN"
              />
            </div>
          </div>
          <div className="flex flex-row mt-4 gap-4">
            <label className="text-xs w-[100px] pt-2">Whitelist IPs</label>
            <div className="flex flex-col gap-2 px-4 py-3 border border-slate-4 rounded-md flex-grow text-xs">
              <div className="flex flex-row flex-grow text-xs text-slate-11">
                <p>
                  Allow Dataland to connect to Snowflake via these IPs&nbsp;
                </p>
                <Link
                  href="https://dataland-io.notion.site/Dataland-1B-Docs-183938a2184e4e95ab7b815109784029"
                  target="_blank"
                >
                  (<span className="underline">see docs</span>)
                </Link>
              </div>
              <div className="flex flex-row gap-4">
                <CopyableIP ip="000.000.00.00" />
                <CopyableIP ip="111.111.111.11" />
                <CopyableIP ip="222.222.22" />
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-end mt-8 gap-4 text-xs">
            <button>Test connection</button>
            <button>Add source</button>
          </div>
        </form>
      </div>
    </div>
  );
}
