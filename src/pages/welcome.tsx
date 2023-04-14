import React from "react";
import Link from "next/link";
import { useUser } from "../components/UserContext";
import { useRouter } from "next/router";

interface AccountHeaderProps {
  email: string;
}

const AccountHeader: React.FC<AccountHeaderProps> = ({ email }) => {
  const { user, logout } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login?lo=true");
  };

  return (
    <div className="w-full flex flex-row h-16 items-center p-12 bg-slate-1">
      <div className="flex flex-col grow items-start">
        <p className="text-sm text-slate-11 mb-1">Logged in as:</p>
        <p className="text-sm text-white font-medium">{email}</p>
      </div>
      <div className="flex flex-col grow items-end">
        <Link href="/">
          <p
            className="text-sm text-white hover:text-slate-12 font-medium"
            onClick={handleLogout}
          >
            Logout
          </p>
        </Link>
      </div>
    </div>
  );
};

export default function Welcome() {
  const { user } = useUser();
  const email = user?.email;

  return (
    <div className="h-screen bg-slate-1">
      <AccountHeader email={email ?? "placeholder"} />
      <div className="flex flex-col justify-center items-center w-full pt-32">
        <div className="bg-slate-1 text-white text-center text-2xl pb-4">
          Welcome to Dataland, Arthur.
        </div>
        <div className="text-slate-11 max-w-md text-center text-lg pb-8">
          Dataland makes it easy for your whole team to browse data from your
          data warehouse.
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-lg rounded-md">
          Get started
        </button>{" "}
        .
      </div>
    </div>
  );
}
