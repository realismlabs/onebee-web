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
        <p className="text-sm text-gray-500 font-medium mb-0.5">
          Logged in as:
        </p>
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

  if (!user) {
    return <div>Loading...</div>;
  }

  if (!email) {
    return <div>Something went wrong</div>;
  }

  return (
    <>
      <AccountHeader email={email} />
      <>
        <div className="bg-slate-1 text-white">Hello</div>
      </>
    </>
  );
}
