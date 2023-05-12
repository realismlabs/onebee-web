import React, { useState, useEffect } from "react";
import Link from "next/link";
import router from "next/router";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCurrentWorkspace } from "@/hooks/useCurrentWorkspace";
import { createWorkspace } from "@/utils/api";
import WorkspaceLayout from "@/components/WorkspaceLayout";

export default function Settings() {

  const [selectedTab, setSelectedTab] = useState<string>("workspace_general")
  const [workspaceDisplayName, setWorkspaceDisplayName] = useState<string>("")
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
      <div className="h-screen bg-slate-1 overflow-y-auto">
        <div className="flex flex-col justify-center items-center w-full pt-16">
          <div className="bg-slate-1 text-slate-12 text-left flex flex-col items-start text-[22px] pb-4 w-[1000px] gap-4 mr-[-24px]">
            <div className="flex flex-row gap-16 w-full">
              <div className="flex flex-col">
                <div className="px-[12px] items-start text-left text-[16px] pb-[16px] w-full">
                  Settings
                </div>
                <div className="flex flex-col w-[120px] gap-8">
                  <div className="flex flex-col gap-0">
                    <div className="text-slate-11 text-[12px] py-[4px] px-[12px]">
                      Workspace
                    </div>
                    <div
                      className={`text-slate-12 text-[13px] hover:bg-slate-3 py-[4px] px-[12px] rounded-md 
                    ${selectedTab === "workspace_general" ? "bg-slate-3" : ""
                        }`
                      }
                    >
                      General
                    </div>
                    <div
                      className="text-slate-12 text-[13px] hover:bg-slate-3 py-[4px] px-[12px] rounded-md"
                    >
                      Members
                    </div>
                  </div>
                  <div className="flex flex-col gap-0">
                    <div className="text-slate-11 text-[12px] py-[4px] px-[12px]">
                      Account
                    </div>
                    <div className={`text-slate-12 text-[13px] hover:bg-slate-3 py-[4px] px-[12px] rounded-md 
                    ${selectedTab === "account_profile" ? "bg-slate-3" : ""
                      }`
                    }>
                      Profile
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col grow">
                {selectedTab === "workspace_general" && (
                  <>
                    <div className="items-start text-left text-[16px] pb-[16px] border-b border-slate-4 w-full">
                      General
                    </div>
                    <div className="flex flex-col text-[14px] mt-[16px]">
                      <div className="flex flex-col gap-4 mt-6">
                        <label className="text-[13px] w-[120px]">Workspace name</label>
                        <input
                          className="rounded-md block w-full bg-slate-3 text-slate-12 text-[13px] py-2 px-3 border border-slate-6 hover:border-slate-7 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-slate-10"
                          required
                          value={workspaceDisplayName}
                          onChange={(e) => setWorkspaceDisplayName(e.target.value)}
                          placeholder="Workspace name"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </WorkspaceLayout>

  );
}
