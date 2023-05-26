import Link from "next/link";
import router, { useRouter } from "next/router";
import Image from "next/image";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCurrentWorkspace } from "@/hooks/useCurrentWorkspace";
import { updateUser } from "@/utils/api";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useQueries,
} from "@tanstack/react-query";
import WorkspaceLayout from "@/components/WorkspaceLayout";
import { Dialog } from "@headlessui/react";
import React, { SyntheticEvent, useState, useEffect } from "react";
import { useSignIn, useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import Head from "next/head";
import { CircleNotch, CheckCircle, X, XCircle } from "@phosphor-icons/react";
import { UserProfile } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { Toaster, toast } from "sonner";

export default function Profile() {
  const { getToken } = useAuth();
  const handleRenameUser = async (e: any) => {
    e.preventDefault();
    console.log("clicked");
    if (userName === "" || userName === null) {
      setErrorMessage("Name is required.");
    } else {
      const userData = {
        name: userName,
      };
      const jwt = await getToken({ template: "test" });
      try {
        const response = await updateUserMutation.mutateAsync({
          userId: currentUser.id,
          userData: userData,
          jwt,
        });
        toast(`Successfully updated name`, {
          icon: (
            <CheckCircle
              size={20}
              weight="fill"
              className="text-green-500 mt-1.5"
            />
          ),
        });
      } catch (error) {
        console.error("Error updating name:", error);
        toast(`Unexpected error occurred`, {
          icon: (
            <XCircle size={20} weight="fill" className="text-red-500 mt-1.5" />
          ),
          description: `Error removing invite + ${error}`,
        });
      }
    }
  };
  const [isClerkDialogOpen, setIsClerkDialogOpen] = useState(false);

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

  useEffect(() => {
    if (currentUser?.name) {
      setUserName(currentUser?.name);
    }
  }, [currentUser]);

  if (isUserLoading || isWorkspaceLoading) {
    return <div className="h-screen bg-slate-1"></div>;
  }

  if (userError || workspaceError) {
    return <div>Error: {JSON.stringify(userError)}</div>;
  }

  const email = currentUser.email;

  return (
    <>
      <Head>
        <title>Account profile</title>
      </Head>
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
                      <div className="flex flex-col gap-2">
                        <label className="text-[14px] w-[120px]">Email</label>
                        <div className="text-slate-12 font-medium">
                          {currentUser.email}
                        </div>
                      </div>
                      <form
                        onSubmit={handleRenameUser}
                        className="flex flex-col gap-4 mt-8"
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
                          <p className="text-red-9 text-[13px]">
                            {errorMessage}
                          </p>
                        )}
                        <button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700 text-slate-12 text-[14px] font-medium py-2 px-4 rounded-md self-start"
                        >
                          Save
                        </button>
                      </form>
                      <div className="flex flex-col gap-2 mt-12 w-[360px]">
                        <label className="text-[14px] w-[120px]">
                          Account security
                        </label>
                        <p className="text-slate-11 text-[13px]">
                          Manage other settings like linked accounts, password
                          reset, and active devices.
                        </p>
                        <button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700 text-slate-12 text-[14px] font-medium py-2 px-4 rounded-md self-start mt-2"
                          onClick={() => setIsClerkDialogOpen(true)}
                        >
                          Manage security
                        </button>
                      </div>
                      <Dialog
                        as="div"
                        open={isClerkDialogOpen}
                        onClose={() => setIsClerkDialogOpen(false)}
                        className="absolute inset-0 flex min-w-full h-screen"
                      >
                        <Dialog.Overlay>
                          <div className="fixed inset-0 bg-slate-1 opacity-50" />
                        </Dialog.Overlay>
                        <Dialog.Panel className="absolute z-30 top-[10vh] max-h-[80vh] left-[50%] translate-x-[-50%] overflow-y-scroll">
                          <div className="flex flex-col bg-slate-2 border border-slate-4 rounded-[8px] w-full p-[24px] text-slate-12">
                            {/* Close */}
                            <div className="rounded-[4px] text-[13px] absolute right-[16px] top-[16px] z-40">
                              <button
                                onClick={() => {
                                  setIsClerkDialogOpen(false);
                                }}
                                className="text-slate-11 hover:bg-slate-4 rounded-md h-[24px] w-[24px] ml-[12px] flex items-center justify-center"
                              >
                                <X size={16} />
                              </button>
                            </div>
                            <Dialog.Title className="text-[14px] font-semibold w-full border-b border-slate-6 pb-4">
                              Account security
                            </Dialog.Title>
                            <UserProfile
                              appearance={{
                                elements: {
                                  card: "bg-slate-2 ml-[-32px] shadow-none", // the margin hides the clerk tag
                                  navbar: "hidden",
                                  profileSection__profile: "hidden",
                                  profileSection__emailAddresses: "hidden",
                                  formFieldLabel:
                                    "text-[14px] font-normal pb-2",
                                  formFieldInput:
                                    "bg-slate-3 border border-slate-6 focus:outline-none focus:ring-blue-600 text-[14px] rounded-md placeholder-slate-9",
                                  profileSectionTitleText:
                                    "text-[14px] font-normal",
                                  profileSectionPrimaryButton:
                                    "text-blue-500 hover:bg-blue-2 tracking-normal",
                                  formButtonReset:
                                    "text-blue-500 hover:bg-blue-2 tracking-normal",
                                  badge:
                                    "text-blue-500 bg-blue-2 tracking-normal",
                                  profileSectionContent__activeDevices:
                                    "tracking-normal",
                                  accordionTriggerButton: "tracking-normal",
                                  headerTitle: "text-[16px] font-medium",
                                  formFieldInput__signOutOfOtherSessions:
                                    "h-[24px] w-[24px] max-w-[24px] p-0 text-blue-500 active:text-blue-500",
                                  formFieldLabelRow__signOutOfOtherSessions:
                                    "pl-2 h-[24px] pt-2",
                                },
                              }}
                            />
                          </div>
                        </Dialog.Panel>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Toaster
          theme="dark"
          expand
          visibleToasts={6}
          toastOptions={{
            style: {
              background: "var(--slate1)",
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              borderColor: "var(--slate4)",
            },
          }}
        />
      </WorkspaceLayout>
    </>
  );
}
