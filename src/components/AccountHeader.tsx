import React from "react";
import { useClerk } from "@clerk/clerk-react";
import { useQueryClient } from "@tanstack/react-query";

interface AccountHeaderProps {
  email: string;
}
export const AccountHeader: React.FC<AccountHeaderProps> = ({ email }) => {
  const { signOut } = useClerk();

  const queryClient = useQueryClient();

  const handleLogout = async () => {
    queryClient.removeQueries();
    signOut();
  };

  return (
    <div className="w-full flex flex-row min-h-16 items-center p-12 z-50">
      <div className="flex flex-col grow items-start">
        <p className="text-[13px] text-slate-11 mb-1">Logged in as:</p>
        <p className="text-[13px] text-slate-12 font-medium">{email}</p>
      </div>
      <div className="flex flex-col grow items-end">
        <p
          className="text-[13px] text-slate-12 hover:text-slate-12 font-medium cursor-pointer"
          onClick={handleLogout}
        >
          Log out
        </p>
      </div>
    </div>
  );
};
