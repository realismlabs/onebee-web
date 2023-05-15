import React, { useState, useEffect } from "react";
import Link from "next/link";
import router from "next/router";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCurrentWorkspace } from "@/hooks/useCurrentWorkspace";
import { updateWorkspace } from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import WorkspaceLayout from "@/components/WorkspaceLayout";

export default function Settings() {


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("clicked");
    if (workspaceName === "" || workspaceName === null) {
      setErrorMessage("Workspace name is required.");
    } else {
      // TODO: Create workspace and mock API call to create workspace + allow others to join from same domain (if enabled)
      console.log(
        "TODO: Rename workspace and mock API call"
      );

      const workspaceData = {
        name: workspaceName
      }
      try {
        console.log("awu attempting call", {workspaceId: currentWorkspace.id, workspaceData: workspaceData })

        const response = await updateWorkspace({workspaceId: currentWorkspace.id, workspaceData: workspaceData})
        console.log("awu response", response)
        // await updateWorkspaceMutation.mutateAsync({workspaceId: currentWorkspace.id, workspaceData: workspaceData });
      } catch (error) {
        console.error('Error updating table:', error);
      }
    }
  }

  const queryClient = useQueryClient();

  const updateWorkspaceMutation = useMutation(updateWorkspace, {
    onSuccess: (updatedTable) => {
      console.log("awu Here is the updated table", updatedTable)
      queryClient.refetchQueries(["currentWorkspace", currentWorkspace?.id])
    },
    onError: (error) => {
      console.error('awu error updating workspace', error)
    }
  });

  const [selectedTab, setSelectedTab] = useState<string>("workspace_general")
  const [errorMessage, setErrorMessage] = React.useState("");
  const [workspaceName, setWorkspaceName] = useState<string>()
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

  useEffect(() => {
    if (currentWorkspace?.name) {
      setWorkspaceName(currentWorkspace?.name);
    }
  }, [currentWorkspace]);


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
                      <div className="flex flex-col gap-4">
                        <form
                          onSubmit={handleSubmit}
                          className="flex flex-col"
                        >
                          <label className="text-[13px] w-[120px]">Workspace name</label>
                          <input
                            type={"text"}
                            id="workspaceNameInput"
                            value={workspaceName}
                            onChange={(e) => {
                              setWorkspaceName(e.target.value);
                              setErrorMessage("");
                            }}
                            placeholder="i.e. Acme organization"
                            className={`mt-4 bg-slate-3 border text-slate-12 text-[14px] rounded-md px-3 py-2 placeholder-slate-9 w-[240px]
                              ${errorMessage !== "" ? "border-red-9" : "border-slate-6"} 
                              focus:outline-none focus:ring-blue-600
                              `}
                          />

                          {errorMessage && (
                            <p className="text-red-9 text-[13px] mt-3">{errorMessage}</p>
                          )}
                          <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-slate-12 text-[14px] font-medium py-2 px-4 rounded-md mt-4 self-start"
                          >
                            Save
                          </button>
                        </form>
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
