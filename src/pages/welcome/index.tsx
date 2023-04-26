import React from "react";
import Link from "next/link";
import { useUser } from "../../components/UserContext";
import router from "next/router";

interface AccountHeaderProps {
  email: string;
}

const handleSubmit = async () => {
  console.log("clicked");
  router.push("/welcome/create-workspace");
};

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

export default function Welcome() {
  const { user } = useUser();
  const email = user?.email;

  return (
    <div className="h-screen bg-slate-1">
      <AccountHeader email={email ?? "placeholder@example.com"} />
      <div className="flex flex-col justify-center items-center w-full pt-32">
        <div className="bg-slate-1 text-white text-center text-2xl pb-4">
          Welcome to Dataland, Arthur.
        </div>
        <div className="text-slate-11 max-w-md text-center text-lg pb-8">
          Dataland makes it easy for your whole team to browse data from your
          data warehouse.
        </div>
        <button
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md"
          onClick={handleSubmit}
        >
          Get started
        </button>
      </div>
    </div>
  );
}
