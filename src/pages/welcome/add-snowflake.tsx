import React, { useState, useEffect, FC } from "react";
import Link from "next/link";
import { useUser } from "../../components/UserContext";
import router from "next/router";
import Image from "next/image";
import { CaretLeft } from "@phosphor-icons/react";
import { Switch } from "@headlessui/react";
import useMeasure from "react-use-measure";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";

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
          <div className="flex flex-row items-center mt-4 gap-4">
            <label className="text-xs w-[100px]">Account</label>
            <div className="flex flex-row items-center">
              <input
                className="rounded-l block w-full bg-slate-3 text-white text-xs py-2 px-3 border border-slate-6 hover:border-slate-7 focus:outline-none focus:ring-1 focus:ring-blue-600 z-20"
                required
                placeholder="account_name"
              />
              <div className="rounded-r block bg-slate-6 text-white border-t border-r border-b border-slate-6 text-xs py-2 px-3 ">
                .snowflakecomputing.com
              </div>
            </div>
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
          <div className="flex flex-row items-center mt-4 gap-4">
            <label className="text-xs w-[100px]">Warehouse</label>
            <div className="flex flex-row items-center flex-grow">
              <input
                className="rounded-md block w-full bg-slate-3 text-white text-xs py-2 px-3 border border-slate-6 hover:border-slate-7 focus:outline-none focus:ring-1 focus:ring-blue-600 z-20"
                required
                placeholder="i.e. COMPUTE_WH"
              />
            </div>
          </div>
          <div>
            <label className="text-white text-xs font-medium">
              Auth method
            </label>

            <select
              className="mt-2 block text-xs bg-gray-900 w-full rounded-md border-gray-700 py-2 pl-3 pr-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              onChange={(e) => setSnowflakeAuthMethod(e.target.value)}
            >
              <option value="user_pass">Username / password</option>
              <option value="key_value">Key / value pair</option>
            </select>
          </div>
          <motion.div
            animate={{
              height:
                snowflakeAuthBounds.height > 0
                  ? snowflakeAuthBounds.height
                  : "auto",
            }}
            transition={{
              type: "spring",
              bounce: 0.2,
              duration: transition.duration,
            }}
          >
            <div ref={snowflakeAuthRef}>
              <AnimatePresence mode="popLayout">
                {snowflake_auth_method === "user_pass" ? (
                  <motion.div
                    exit={{ opacity: 0 }}
                    transition={{
                      ...transition,
                      duration: transition.duration / 2,
                    }}
                    key="snowflake_auth_form"
                    className="flex flex-col gap-4"
                  >
                    <div>
                      <label className="text-white text-xs font-medium">
                        Username
                      </label>
                      <input
                        className="block w-full rounded bg-gray-900 text-white text-xs py-2 px-3 mt-2 border border-gray-700 hover:border-gray-600 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-white text-xs font-medium">
                        Password
                      </label>
                      <input
                        className="block w-full rounded bg-gray-900 text-white text-xs py-2 px-3 mt-2 border border-gray-700 hover:border-gray-600 focus:border-blue-500"
                        required
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    exit={{ opacity: 0 }}
                    transition={{
                      ...transition,
                      duration: transition.duration / 2,
                    }}
                    key="snowflake_auth_form"
                  >
                    <div className="mb-4">
                      <label className="text-white text-xs font-medium">
                        Key
                      </label>
                      <input
                        className="block w-full rounded bg-gray-900 text-white text-xs py-2 px-3 mt-2 border border-gray-700 hover:border-gray-600 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-white text-xs font-medium">
                        Value
                      </label>
                      <input
                        className="block w-full rounded bg-gray-900 text-white text-xs py-2 px-3 mt-2 border border-gray-700 hover:border-gray-600 focus:border-blue-500"
                        required
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
