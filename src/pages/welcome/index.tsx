import React from "react";
import Link from "next/link";
import router from "next/router";
import { useCurrentUser } from "../../hooks/useCurrentUser";

interface AccountHeaderProps {
  email: string;
}

const handleSubmit = async () => {
  console.log("clicked");
  router.push("/welcome/create-workspace");
};

const AccountHeader: React.FC<AccountHeaderProps> = ({ email }) => {
  const handleLogout = () => {
    router.push("/login?lo=true");
  };

  return (
    <div className="w-full flex flex-row h-16 items-center p-12 bg-slate-1">
      <div className="flex flex-col grow items-start">
        <p className="text-[13px] text-slate-11 mb-1">Logged in as:</p>
        <p className="text-[13px] text-slate-12 font-medium">{email}</p>
      </div>
      <div className="flex flex-col grow items-end">
        <p
          className="text-[13px] text-slate-12 hover:text-slate-12 font-medium cursor-pointer"
          onClick={handleLogout}
        >
          Logout
        </p>
      </div>
    </div>
  );
};

export default function Welcome() {
  const {
    data: currentUser,
    isLoading: isUserLoading,
    error: userError,
  } = useCurrentUser();

  if (isUserLoading) {
    return <div className="h-screen bg-slate-1"></div>;
  }

  if (userError) {
    return <div>Error: {JSON.stringify(userError)}</div>;
  }

  const email = currentUser.email;

  return (
    <div className="h-screen bg-slate-1">
      <AccountHeader email={email ?? "placeholder@example.com"} />
      <div className="flex flex-col justify-center items-center w-full pt-32">
        <div className="bg-slate-1 text-slate-12 text-center text-[22px] pb-4">
          Welcome to Dataland, Arthur.
        </div>
        <div className="text-slate-11 max-w-md text-center text-lg pb-8">
          Dataland makes it easy for your whole team to browse data from your
          data warehouse.
        </div>
        <button
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-slate-12 text-[14px] font-medium py-2 px-4 rounded-md"
          onClick={handleSubmit}
        >
          Get started
        </button>
      </div>
    </div>
  );
}
