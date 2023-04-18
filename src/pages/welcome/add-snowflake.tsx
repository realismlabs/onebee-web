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
  let [useProxy, setUseProxy] = useState(false);
  let [snowflakeAuthMethod, setSnowflakeAuthMethod] = useState("user_pass");

  // Snowflake vars
  const [accountName, setAccountName] = useState<string>("");
  const [proxyName, setProxyName] = useState<string>("");
  const [warehouse, setWarehouse] = useState<string>("");
  const [authUsername, setAuthUsername] = useState<string>("");
  const [authPassword, setAuthPassword] = useState<string>("");
  const [authKey, setAuthKey] = useState<string>("");
  const [authValue, setAuthValue] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [connectionResult, setConnectionResult] = useState<string>("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // get form data
    const data = {
      accountName,
      warehouse,
      useProxy,
      proxyName,
      snowflakeAuthMethod,
      authUsername,
      authPassword,
      authKey,
      authValue,
      role,
    };
    console.log("clicked", data);
  };

  const handleConnectionTest = (e: any) => {
    const data = {
      accountName,
      warehouse,
      authUsername,
      authPassword,
      authKey,
      authValue,
      role,
    };
    console.log("handleConnectionTest", data);
  };

  return (
    <div className="h-screen bg-slate-1">
      <AccountHeader email={email ?? "placeholder@example.com"} />
      <div className="flex flex-col mx-auto w-[600px] text-white gap-2 mt-16">
        <Link href="/welcome/add-data-source">
          <div className="flex flex-row items-center gap-2 text-xs text-slate-11">
            <CaretLeft size={16} weight="bold" />
            <p>Back to sources</p>
          </div>
        </Link>
        <div className="flex flex-row items-center gap-4 mt-4">
          <Image
            src="../../images/logos/logo_snowflake.svg"
            width={24}
            height={24}
            alt="Snowflake logo"
            draggable={false}
          ></Image>
          <p className="flex-grow text-md">Set up Snowflake connection</p>
          <Link href="/" className="text-xs px-3 py-2 bg-slate-3 rounded-md">
            Snowflake docs
          </Link>
        </div>
        <form onSubmit={handleSubmit}>
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
              {useProxy ? (
                <>
                  <input
                    className="rounded block w-full bg-slate-3 text-white text-xs py-2 px-3 border border-slate-6 hover:border-slate-7 focus:outline-none focus:ring-1 focus:ring-blue-600 z-20 placeholder-slate-10"
                    required
                    placeholder="Full proxy address"
                    value={proxyName}
                    onChange={(e) => setProxyName(e.target.value)}
                  />
                </>
              ) : (
                <>
                  <input
                    className="rounded-l block w-full bg-slate-3 text-white text-xs py-2 px-3 border border-slate-6 hover:border-slate-7 focus:outline-none focus:ring-1 focus:ring-blue-600 z-20 placeholder-slate-10"
                    required
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
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
                checked={useProxy}
                onChange={setUseProxy}
                className={`${
                  useProxy ? "bg-blue-600" : "bg-slate-6"
                } relative inline-flex h-6 w-11 items-center rounded-full overflow-hidden`}
              >
                <span
                  className={`${
                    useProxy ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>
          </div>
          <div className="flex flex-row items-center mt-4 gap-4">
            <label className="text-xs w-[100px]">
              <WordTooltipDemo
                display_text={"Warehouse"}
                tooltip_content={
                  <div className="max-w-[200px] space-y-2">
                    <p>
                      We recommend using at least a small size warehouse. Larger
                      sizes will speed up ingest time.
                    </p>
                  </div>
                }
              />
            </label>
            <div className="flex flex-row items-center flex-grow">
              <input
                className="rounded-md block w-full bg-slate-3 text-white text-xs py-2 px-3 border border-slate-6 hover:border-slate-7 focus:outline-none focus:ring-1 focus:ring-blue-600 z-20 placeholder-slate-10"
                required
                placeholder="i.e. SMALL_WH"
                value={warehouse}
                onChange={(e) => setWarehouse(e.target.value)}
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
          <div>
            {snowflakeAuthMethod === "user_pass" ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-row items-center mt-4 gap-4">
                  <label className="text-xs w-[100px]">Username</label>
                  <input
                    className="flex-grow rounded-md block bg-slate-3 text-white text-xs py-2 px-3 border border-slate-6 hover:border-slate-7 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-slate-10"
                    required
                    placeholder=""
                    title="Username"
                    value={authUsername}
                    onChange={(e) => setAuthUsername(e.target.value)}
                  />
                </div>
                <div className="flex flex-row items-center gap-4">
                  <label className="text-xs w-[100px]">Password</label>
                  <input
                    className="flex-grow rounded-md block bg-slate-3 text-white text-xs py-2 px-3 border border-slate-6 hover:border-slate-7 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-slate-10"
                    required
                    placeholder=""
                    title="Password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
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
                      value={authKey}
                      onChange={(e) => setAuthKey(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-row items-center gap-4">
                    <label className="text-xs w-[100px]">Value</label>
                    <input
                      className="flex-grow rounded-md block bg-slate-3 text-white text-xs py-2 px-3 border border-slate-6 hover:border-slate-7 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-slate-10"
                      required
                      placeholder=""
                      title="Value"
                      value={authValue}
                      onChange={(e) => setAuthValue(e.target.value)}
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
                placeholder="i.e. PUBLIC"
                value={role}
                onChange={(e) => setRole(e.target.value)}
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
            <button
              onClick={handleConnectionTest}
              className="text-xs px-3 py-2 bg-slate-3 rounded-md"
            >
              Test connection
            </button>
            <button>Add source</button>
          </div>
        </form>
      </div>
    </div>
  );
}
