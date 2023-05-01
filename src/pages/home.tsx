import React, { useState, useEffect } from "react";
import Link from "next/link";
import router from "next/router";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useCurrentWorkspace } from "@/hooks/useCurrentWorkspace";
import { createWorkspace } from "@/utils/api";
import WorkspaceLayout from "@/components/WorkspaceLayout";

interface AccountHeaderProps {
  email: string;
}

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

export default function CreateWorkspace() {
  const {
    data: currentUser,
    isLoading: isUserLoading,
    error: userError,
  } = useCurrentUser();

  const {
    data: currentWorkspace,
    isLoading: isWorkspaceLoading,
    error: workspaceError,
  } = useCurrentWorkspace();

  if (isUserLoading) {
    return <div className="h-screen bg-slate-1"></div>;
  }

  if (userError) {
    return <div>Error: {JSON.stringify(userError)}</div>;
  }

  const email = currentUser.email;

  return (
    <WorkspaceLayout>
      <div className="h-screen bg-slate-1">
        <div className="flex flex-col justify-center items-center w-full pt-32">
          <div className="bg-slate-1 text-slate-12 text-left flex flex-col items-start text-[22px] pb-4 w-[800px] gap-4">
            <div className="items-start text-left">
              Hi {email ?? "there"}! Let&apos;s get started.
            </div>
            <div className="p-8 bg-blue-900/20 border border-blue-500 rounded-md w-full">
              {" "}
              Docs
            </div>
            <div className="w-full flex flex-row gap-4">
              <div className="p-8 bg-blue-900/20 border border-blue-500 rounded-md w-full">
                {" "}
                Docs
              </div>
              <div className="p-8 bg-blue-900/20 border border-blue-500 rounded-md w-full">
                {" "}
                Docs
              </div>
            </div>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
