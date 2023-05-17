import React, { useState, useEffect } from "react";
import Link from "next/link";
import router, { useRouter } from "next/router";
import Image from "next/image";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCurrentWorkspace } from "@/hooks/useCurrentWorkspace";
import {
  deleteWorkspace,
  updateWorkspace,
  getWorkspaceMemberships,
  getUser,
  updateUser,
} from "@/utils/api";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useQueries,
} from "@tanstack/react-query";
import WorkspaceLayout from "@/components/WorkspaceLayout";
import { X } from "@phosphor-icons/react";
import { Dialog } from "@headlessui/react";
import { friendlyRelativeDateToNow } from "@/utils/util";

export default function Profile() {
  const handleRenameUser = async (e: any) => {
    e.preventDefault();
    console.log("clicked");
    if (userName === "" || userName === null) {
      setErrorMessage("Name is required.");
    } else {
      const userData = {
        name: userName,
      };
      try {
        const response = await updateUserMutation.mutateAsync({
          userId: currentUser.id,
          userData: userData,
        });
      } catch (error) {
        console.error("Error updating workspace:", error);
      }
    }
  };

  const queryClient = useQueryClient();

  const updateUserMutation = useMutation(updateUser, {
    onSuccess: async (updatedUser) => {
      await queryClient.refetchQueries(["currentUser", currentUser?.id]);
    },
    onError: (error) => {
      console.error("Error updating user", error);
    },
  });

  // get router path - foramt is /workspace/6/settings/members, need to grab everything after /settings/
  const router = useRouter();
  const routerPath = router.asPath;

  const [errorMessage, setErrorMessage] = React.useState("");
  const [userName, setUserName] = useState<string>();
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

  const {
    data: membershipsData,
    isLoading: isMembershipsLoading,
    error: membershipsError,
  } = useQuery({
    queryKey: ["getWorkspaceMemberships", currentWorkspace?.id],
    queryFn: async () => {
      const response = await getWorkspaceMemberships(currentWorkspace?.id);
      return response;
    },
    enabled: currentWorkspace?.id !== null,
  });

  //  fetch user data for each membership
  const usersData = useQueries({
    queries: (membershipsData ?? []).map((membership: any) => {
      return {
        queryKey: ["getUser", membership.userId],
        queryFn: async () => {
          const response = await getUser(membership.userId);
          return response;
        },
        enabled: membership.userId !== null,
      };
    }),
  });

  const currentUserMembership = membershipsData?.find(
    (membership: any) => membership.userId === currentUser?.id
  );

  useEffect(() => {
    if (currentUser?.name) {
      setUserName(currentUser?.name);
    }
  }, [currentUser]);

  if (isUserLoading || isWorkspaceLoading || isMembershipsLoading) {
    return <div className="h-screen bg-slate-1"></div>;
  }

  if (userError || workspaceError || membershipsError) {
    return <div>Error: {JSON.stringify(userError)}</div>;
  }

  const email = currentUser.email;

  return (
    <WorkspaceLayout>
      <div className="h-screen bg-slate-1 overflow-y-auto">
        <div className="flex flex-col justify-center items-center w-full pt-16">
          <div className="bg-slate-1 text-slate-12 text-left flex flex-col items-start text-[22px] pb-4 w-[1000px] gap-4 mr-[-24px]">
            <div className="flex flex-row gap-[100px] w-full">
              <div className="flex flex-col">
                <div className="flex flex-col w-[120px] gap-8">
                  <div className="flex flex-col w-[120px] gap-8">
                    <div className="flex flex-col gap-0">
                      <div className="px-[12px] items-start text-left text-[16px] pb-[16px] w-full">
                        Settings
                      </div>
                      <div className="text-slate-11 text-[12px] tracking-wide py-[4px] px-[12px]">
                        Workspace
                      </div>
                      <Link
                        href={`/workspace/${currentWorkspace?.id}/settings/general`}
                      >
                        <div
                          className={`text-slate-12 text-[13px] hover:bg-slate-3 py-[4px] px-[12px] rounded-md 
                    ${routerPath.includes("general") ? "bg-slate-3" : ""}`}
                        >
                          General
                        </div>
                      </Link>
                      <Link
                        href={`/workspace/${currentWorkspace?.id}/settings/members`}
                      >
                        <div
                          className={`text-slate-12 text-[13px] hover:bg-slate-3 py-[4px] px-[12px] rounded-md 
                    ${routerPath.includes("members") ? "bg-slate-3" : ""}`}
                        >
                          Members
                        </div>
                      </Link>
                    </div>
                    <div className="flex flex-col gap-0">
                      <div className="text-slate-11 text-[12px] tracking-wide py-[4px] px-[12px]">
                        Account
                      </div>
                      <Link
                        href={`/workspace/${currentWorkspace?.id}/settings/profile`}
                      >
                        <div
                          className={`text-slate-12 text-[13px] hover:bg-slate-3 py-[4px] px-[12px] rounded-md 
                    ${routerPath.includes("profile") ? "bg-slate-3" : ""}`}
                        >
                          Profile
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col grow">
                <div className="items-start text-left text-[16px] pb-[16px] border-b border-slate-4 w-full">
                  Profile
                </div>
                <div className="flex flex-col text-[14px] mt-[16px]">
                  <div className="flex flex-col">
                    <form
                      onSubmit={handleRenameUser}
                      className="flex flex-col gap-4"
                    >
                      <div className="flex flex-col gap-2">
                        <label className="text-[14px] w-[120px]">Name</label>
                        <input
                          type={"text"}
                          id="userNameInput"
                          value={userName}
                          onChange={(e) => {
                            setUserName(e.target.value);
                            setErrorMessage("");
                          }}
                          placeholder="i.e. Acme organization"
                          className={`bg-slate-3 border text-slate-12 text-[14px] rounded-md px-3 py-2 placeholder-slate-9 w-[240px]
                                  ${
                                    errorMessage !== ""
                                      ? "border-red-9"
                                      : "border-slate-6"
                                  }
                                  focus:outline-none focus:ring-blue-600
                                  `}
                        />
                      </div>
                      {errorMessage && (
                        <p className="text-red-9 text-[13px]">{errorMessage}</p>
                      )}
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-slate-12 text-[14px] font-medium py-2 px-4 rounded-md self-start"
                      >
                        Save
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
