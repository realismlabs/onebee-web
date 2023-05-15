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

export default function Settings() {
  const handleRenameWorkspace = async (e: any) => {
    e.preventDefault();
    console.log("clicked");
    if (workspaceName === "" || workspaceName === null) {
      setErrorMessage("Workspace name is required.");
    } else {
      // TODO: Create workspace and mock API call to create workspace + allow others to join from same domain (if enabled)
      console.log("TODO: Rename workspace and mock API call");

      const workspaceData = {
        name: workspaceName,
      };
      try {
        console.log("awu attempting call", {
          workspaceId: currentWorkspace.id,
          workspaceData: workspaceData,
        });

        // const response = await updateWorkspace({
        //   workspaceId: currentWorkspace.id,
        //   workspaceData: workspaceData,
        // });
        const response = await updateWorkspaceMutation.mutateAsync({
          workspaceId: currentWorkspace.id,
          workspaceData: workspaceData,
        });

        console.log("awu response", response);
      } catch (error) {
        console.error("Error updating workspace:", error);
      }
    }
  };

  const handleDeleteWorkspace = async () => {
    try {
      const response = await deleteWorkspaceMutation.mutateAsync({
        workspaceId: currentWorkspace.id,
      });
    } catch (error) {
      console.error("Error deleting workspace:", error);
    }
  };

  const [isDeleteWorkspaceDialogOpen, setIsDeleteWorkspaceDialogOpen] =
    useState(false);
  const [deleteWorkspaceErrorMessage, setDeleteWorkspaceErrorMessage] =
    useState("");

  const openDeleteWorkspaceDialog = () => {
    console.log("awu: open delete dialog");
    setIsDeleteWorkspaceDialogOpen(true);
  };

  const closeDeleteWorkspaceDialog = () => {
    setIsDeleteWorkspaceDialogOpen(false);
  };

  const queryClient = useQueryClient();

  const updateWorkspaceMutation = useMutation(updateWorkspace, {
    onSuccess: async (updatedWorkspace) => {
      await queryClient.refetchQueries([
        "currentWorkspace",
        currentWorkspace?.id,
      ]);
    },
    onError: (error) => {
      console.error("Error updating workspace", error);
    },
  });

  const deleteWorkspaceMutation = useMutation(deleteWorkspace, {
    onSuccess: async (deletedWorkspace) => {
      await queryClient.refetchQueries([
        "currentWorkspace",
        currentWorkspace?.id,
      ]);
      // awu: Log the user out (I don't want to giga-brain / confuse the user by switching to a random workspace. This step forces users to select a new workspace)
      // TODO: Handle logout with proper auth
      router.push("/login");
    },
    onError: (error) => {
      console.error("Error updating workspace", error);
    },
  });

  // get router path - foramt is /workspace/6/settings/members, need to grab everything after /settings/
  const router = useRouter();
  const routerPath = router.asPath;

  const [errorMessage, setErrorMessage] = React.useState("");
  const [workspaceName, setWorkspaceName] = useState<string>();
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
  const usersQueries = useQueries({
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

  // get data from useQueries
  const usersData = usersQueries.map((user: any) => user.data);

  useEffect(() => {
    if (currentWorkspace?.name) {
      setWorkspaceName(currentWorkspace?.name);
    }
  }, [currentWorkspace]);

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
                  <div className="flex flex-col gap-0">
                    <div className="px-[12px] items-start text-left text-[16px] pb-[16px] w-full">
                      Settings
                    </div>
                    <div className="text-slate-11 text-[12px] py-[4px] px-[12px]">
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
                    <div className="text-slate-11 text-[12px] py-[4px] px-[12px]">
                      Account
                    </div>
                    <div
                      className={`text-slate-12 text-[13px] hover:bg-slate-3 py-[4px] px-[12px] rounded-md 
                    ${routerPath.includes("profile") ? "bg-slate-3" : ""}`}
                    >
                      Profile
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col grow">
                <div className="items-start text-left text-[16px] pb-[16px] border-b border-slate-4 w-full">
                  Members
                </div>
                <div className="flex flex-col border-slate-4 rounded-lg border overflow-clip mt-4">
                  {membershipsData.length > 0 &&
                    membershipsData.map((membership: any, index: number) => (
                      <div
                        key={membership.id}
                        className={`flex flex-row gap-4 items-center ${
                          index < membershipsData.length - 1
                            ? "border-b border-slate-4"
                            : ""
                        } text-[13px] px-[20px] py-[12px] cursor-pointer bg-slate-1 hover:bg-slate-2 text-slate-12`}
                      >
                        <div className="w-[160px] truncate">
                          {/* find the user name given the membership userID */}
                          {usersData
                            .filter(
                              (user: any) => user.id === membership.userId
                            )
                            .map((user: any) => (
                              <div key={user.id}>{user.name}</div>
                            ))}
                        </div>
                        <div className="w-[320px] truncate">
                          {/* find the user name given the membership userID */}
                          {usersData
                            .filter(
                              (user: any) => user.id === membership.userId
                            )
                            .map((user: any) => (
                              <div key={user.id}>{user.email}</div>
                            ))}
                        </div>
                        <div className="min-w-[100px] max-w-[100px] text-left text-slate-11">
                          {friendlyRelativeDateToNow(membership.createdAt)}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
