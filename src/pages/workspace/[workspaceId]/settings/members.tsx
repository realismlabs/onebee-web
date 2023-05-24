import React, { useState, useEffect, Fragment } from "react";
import Head from "next/head";
import Link from "next/link";
import router, { useRouter } from "next/router";
import Image from "next/image";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCurrentWorkspace } from "@/hooks/useCurrentWorkspace";
import { useClerk } from "@clerk/clerk-react";
import {
  updateWorkspace,
  getWorkspaceMemberships,
  getUser,
  deleteMembership,
  getWorkspaceInvites,
  deleteWorkspaceInvite,
  updateMembership,
} from "@/utils/api";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useQueries,
} from "@tanstack/react-query";
import WorkspaceLayout from "@/components/WorkspaceLayout";
import {
  Globe,
  X,
  DotsThree,
  Trash,
  CaretDown,
  Check,
} from "@phosphor-icons/react";
import { Dialog, Popover, Transition } from "@headlessui/react";
import {
  capitalizeString,
  getInitials,
  isCommonEmailProvider,
} from "@/utils/util";
import { v4 as uuidv4 } from "uuid";
import InvitePeopleDialog from "@/components/InvitePeopleDialog";
import { useAuth } from "@clerk/nextjs";

const MemberPopover = ({
  currentUser,
  currentUserMembership,
  targetMembership,
}: {
  currentUser: any;
  currentUserMembership: any;
  targetMembership: any;
}) => {
  const { getToken } = useAuth();
  const targetMembershipId = targetMembership.id;
  const userId = targetMembership.userId;
  const workspaceId = targetMembership.workspaceId;

  const { signOut } = useClerk();

  const handleRemoveMember = async () => {
    // check if user is the last member of the workspace. If so, delete the workspace
    const jwt = await getToken({ template: "test" });
    const workspaceMemberships = await getWorkspaceMemberships(
      workspaceId,
      jwt
    );
    // check if there is at least one other admin left besides user
    const otherAdmins = workspaceMemberships.filter(
      (membership: any) =>
        membership.role === "admin" && membership.userId !== currentUser.id
    );

    if (otherAdmins.length >= 1) {
      try {
        const jwt = await getToken({ template: "test" });
        const deletedMembership = await deleteMembershipMutation.mutateAsync({
          membershipId: targetMembershipId,
          jwt,
        });
        if (deletedMembership.userId === currentUser.id) {
          await signOut();
        }
      } catch (error) {
        console.error("Error deleting membership:", error);
      }
    } else {
      // alert that user is the last admin and cannot be removed
      alert(
        `You are the last admin. If you want to delete the workspace, please do so from the settings page. Otherwise, please make another member an admin before removing yourself.`
      );
    }
  };

  const queryClient = useQueryClient();

  const deleteMembershipMutation = useMutation(deleteMembership, {
    onSuccess: async (deletedMembership) => {
      console.log("Membership deleted:", deletedMembership);
      if (userId === currentUser?.id) {
        console.log(
          "TODO: User is deleting their own membership - this should log the user out"
        );
        await signOut();
      } else {
        console.log("Refetching memberships:", userId);
        await queryClient.refetchQueries([
          "getWorkspaceMemberships",
          workspaceId,
        ]);
      }
    },
    onError: (error) => {
      console.error("Error deleting membership:", error);
    },
  });

  if (
    currentUserMembership?.role == "admin" || // Admins can modify all memberships
    currentUserMembership?.id == targetMembership.id // User is allowed to leave workspace aka modify their own membership
  ) {
    return (
      <>
        <Popover className="relative">
          {({ open }) => (
            <>
              <div className="">
                <Popover.Button
                  className={`text-slate-11 hover:bg-slate-3 focus:shadow-slate-7 flex flex-row gap-[4px] px-[8px] py-[4px] items-center rounded-[4px] focus:outline-none
                ${open ? "bg-slate-3" : "hover:bg-slate-3 active:bg-slate-4"}`}
                >
                  <DotsThree
                    size={20}
                    weight="bold"
                    className="mt-[2px] min-h-[12px] min-w-[12px]"
                  />
                </Popover.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute z-10 w-[200px] max-w-[90vw] bg-slate-2 rounded-md shadow-slate-7 border border-slate-4 text-slate-12 focus:outline-none text-[13px]">
                  <div className="flex flex-col px-[8px] py-[8px] w-full text-[13px] text-slate-12">
                    <>
                      <Popover.Button className="w-full">
                        <button
                          className={`hover:bg-slate-4 px-[8px] py-[6px] text-left flex flex-row gap-3 w-full rounded-md items-center
                        `}
                          onClick={() => {
                            handleRemoveMember();
                          }}
                        >
                          <div className="flex flex-row w-full gap-2 items-center">
                            <Trash
                              size={16}
                              weight="bold"
                              className="text-slate-10"
                            />
                            {userId === currentUser?.id
                              ? "Leave workspace"
                              : "Remove member"}
                          </div>
                        </button>
                      </Popover.Button>
                    </>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      </>
    );
  } else {
    return <></>;
  }
};

const MemberRolePopover = ({
  currentUser,
  currentUserMembership,
  targetUserMembership,
  memberships,
}: {
  currentUser: any;
  currentUserMembership: any;
  targetUserMembership: any;
  memberships: any;
}) => {
  const { getToken } = useAuth();
  const currentUserMembershipId = currentUserMembership?.id;
  const targetUserMembershipId = targetUserMembership.id;
  const currentUserId = currentUser.id;
  const workspaceId = currentUserMembership?.workspaceId;

  const handleChangeMemberRole = async (targetUserRole: string) => {
    // check if user's own membership role is admin
    if (currentUserMembership?.role !== "admin") {
      alert("You must be an admin to change a member's role.");
      return;
    }

    //  if user is trying to change their own role from admin → member, check if there are other admins
    if (
      currentUserId === targetUserMembership.userId &&
      targetUserRole === "member"
    ) {
      // check if there is at least one other admin left besides user
      const otherAdmins = memberships.filter(
        (membership: any) =>
          membership.role === "admin" && membership.userId !== currentUserId
      );

      if (otherAdmins == 0) {
        // alert that user is the last admin and cannot be removed
        alert(
          `You are the last admin. If you want to demote yourself, then make another member an admin first.`
        );
        return;
      }
    }

    try {
      const jwt = await getToken({ template: "test" });
      const changedMember = await updateMembershipMutation.mutateAsync({
        membershipId: targetUserMembershipId,
        membershipData: {
          role: targetUserRole,
        },
        jwt,
      });
    } catch (error) {
      alert(`Error updating membership: + ${error}`);
    }
  };

  const queryClient = useQueryClient();

  const updateMembershipMutation = useMutation(updateMembership, {
    onSuccess: async () => {
      await queryClient.refetchQueries([
        "getWorkspaceMemberships",
        workspaceId,
      ]);
    },
    onError: (error) => {
      console.error("Error updating memberships:", error);
    },
  });

  return (
    <>
      <Popover className="relative">
        {({ open }) => (
          <>
            <div className="">
              <Popover.Button
                className={`text-slate-11 focus:shadow-slate-7 flex flex-row gap-[4px] px-[8px] py-[4px] items-center rounded-[4px] focus:outline-none
                ${open ? "bg-slate-3" : ""}
                ${
                  currentUserMembership?.role == "admin"
                    ? "cursor-pointer hover:bg-slate-3 active:bg-slate-4"
                    : "cursor-default"
                }`}
                disabled={currentUserMembership?.role !== "admin"}
              >
                <p className="text-slate-12">
                  {targetUserMembership.role == "admin" ? "Admin" : "Member"}
                </p>
                {currentUserMembership?.role === "admin" && (
                  <CaretDown
                    size={12}
                    weight="fill"
                    className="mt-[2px] min-h-[12px] min-w-[12px]"
                  />
                )}
              </Popover.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-10 w-[280px] max-w-[90vw] bg-slate-2 rounded-md shadow-slate-7 border border-slate-4 text-slate-12 focus:outline-none text-[13px]">
                <div className="flex flex-col px-[8px] py-[8px] w-full text-[13px] text-slate-12">
                  <>
                    <Popover.Button className="w-full">
                      <button
                        className={`hover:bg-slate-4 px-[8px] py-[6px] text-left flex flex-row gap-3 w-full rounded-md items-center
                        `}
                        onClick={() => {
                          handleChangeMemberRole("admin");
                        }}
                      >
                        <div className="flex flex-row w-full gap-4 items-center">
                          <div className="flex flex-col flex-grow">
                            <p>Admin</p>
                            <p className="text-slate-11 text-[13px]">
                              Admins manage workspace membership, roles, and
                              settings
                            </p>
                          </div>
                          <div className="min-w-[24px]">
                            {targetUserMembership.role === "admin" && (
                              <Check
                                size={16}
                                weight="bold"
                                className="text-slate-12 mr-2 flex-none"
                              />
                            )}
                          </div>
                        </div>
                      </button>
                    </Popover.Button>
                    <Popover.Button className="w-full">
                      <button
                        className={`hover:bg-slate-4 px-[8px] py-[6px] text-left flex flex-row gap-3 w-full rounded-md items-center
                        `}
                        onClick={() => {
                          handleChangeMemberRole("member");
                        }}
                      >
                        <div className="flex flex-row w-full gap-4 items-center">
                          <div className="flex flex-col flex-grow">
                            <p>Member</p>
                            <p className="text-slate-11 text-[13px]">
                              Members can invite others to join the workspace
                            </p>
                          </div>
                          <div className="min-w-[24px]">
                            {targetUserMembership.role === "member" && (
                              <Check
                                size={16}
                                weight="bold"
                                className="text-slate-12 mr-2 flex-none"
                              />
                            )}
                          </div>
                        </div>
                      </button>
                    </Popover.Button>
                  </>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </>
  );
};

const InvitePopover = ({
  currentWorkspace,
  workspaceInvite,
}: {
  currentWorkspace: any;
  workspaceInvite: any;
}) => {
  const { getToken } = useAuth();

  const handleDeleteInvite = async () => {
    // User is revoking an invite
    const jwt = await getToken({ template: "test" });
    const deletedWorkspaceInvite =
      await deleteWorkspaceInviteMutation.mutateAsync({
        workspaceId: currentWorkspace.id,
        inviteId: workspaceInvite.id,
        jwt: jwt,
      });
  };

  const queryClient = useQueryClient();

  const deleteWorkspaceInviteMutation = useMutation(deleteWorkspaceInvite, {
    onSuccess: async (deletedInvite) => {
      console.log("deletedInvite:", deletedInvite);
      await queryClient.refetchQueries([
        "getWorkspaceInvites",
        currentWorkspace.id,
      ]);
    },
    onError: (error) => {
      console.error("Error deleting invite:", error);
    },
  });

  return (
    <>
      <Popover className="relative">
        {({ open }) => (
          <>
            <div className="">
              <Popover.Button
                className={`text-slate-11 hover:bg-slate-3 focus:shadow-slate-7 flex flex-row gap-[4px] px-[8px] py-[4px] items-center rounded-[4px] focus:outline-none
                ${open ? "bg-slate-3" : "hover:bg-slate-3 active:bg-slate-4"}`}
              >
                <DotsThree
                  size={20}
                  weight="bold"
                  className="mt-[2px] min-h-[12px] min-w-[12px]"
                />
              </Popover.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-10 w-[200px] max-w-[90vw] bg-slate-2 rounded-md shadow-slate-7 border border-slate-4 text-slate-12 focus:outline-none text-[13px]">
                <div className="flex flex-col px-[8px] py-[8px] w-full text-[13px] text-slate-12">
                  <>
                    <Popover.Button className="w-full">
                      <button
                        className={`hover:bg-slate-4 px-[8px] py-[6px] text-left flex flex-row gap-3 w-full rounded-md items-center
                        `}
                        onClick={() => {
                          handleDeleteInvite();
                        }}
                      >
                        <div className="flex flex-row w-full gap-2 items-center">
                          <Trash
                            size={16}
                            weight="bold"
                            className="text-slate-10"
                          />
                          Revoke invite
                        </div>
                      </button>
                    </Popover.Button>
                  </>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </>
  );
};

export default function Members() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  // get router path - foramt is /workspace/6/settings/members, need to grab everything after /settings/
  const router = useRouter();
  const routerPath = router.asPath;

  const [customMessage, setCustomMessage] = useState<string>(
    "Hi there, \n\nWe're using Dataland.io as an easy and fast way to browse data from our data warehouse. \n\nJoin the workspace in order to browse and search our key datasets."
  );

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
      const jwt = await getToken({ template: "test" });
      const response = await getWorkspaceMemberships(currentWorkspace?.id, jwt);
      return response;
    },
    enabled: currentWorkspace?.id !== null,
  });

  console.log("membershipsData:", membershipsData);
  //  fetch user data for each membership
  const usersQueries = useQueries({
    queries: (membershipsData ?? []).map((membership: any) => {
      return {
        queryKey: ["getUser", membership.userId],
        queryFn: async () => {
          const jwt = await getToken({ template: "test" });
          const response = await getUser(membership.userId, jwt);
          if (response) {
            return response;
          } else {
            return null;
          }
        },
        enabled: membership.userId !== null,
      };
    }),
  });

  const usersData = usersQueries.map((user: any) => user.data);

  // get invites for workspace
  const {
    data: workspaceInvitesData,
    isLoading: isWorkspaceInvitesLoading,
    error: workspaceInvitesError,
  } = useQuery({
    queryKey: ["getWorkspaceInvites", currentWorkspace?.id],
    queryFn: async () => {
      const jwt = await getToken({ template: "test" });
      const response = await getWorkspaceInvites(currentWorkspace?.id, jwt);
      return response;
    },
    enabled: currentWorkspace?.id !== null,
  });

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

  const handleRemoveAllowedDomain = async (allowedDomainId: string) => {
    console.log("clicked");
    // take existing currentWorkspace.allowedDomains and remove the one with the matching id
    const updatedAllowedDomains = currentWorkspace.allowedDomains.filter(
      (allowedDomain: any) => allowedDomain.id !== allowedDomainId
    );

    try {
      const jwt = await getToken({ template: "test" });
      const response = await updateWorkspaceMutation.mutateAsync({
        workspaceId: currentWorkspace.id,
        workspaceData: {
          allowedDomains: updatedAllowedDomains,
        },
        jwt,
      });
    } catch (error) {
      console.error("Error updating workspace:", error);
    }
  };

  // get data from useQueries

  const getUserFromMembership = (membership: any) => {
    return usersData.find((user) => user?.id === membership.userId);
  };

  const currentUserMembership = membershipsData?.find(
    (membership: any) => membership.userId === currentUser?.id
  );

  const handleAddAllowedDomain = async (domain: string) => {
    if (!domain) {
      setAddAllowedDomainErrorMessage("Please enter a domain.");
      return;
    }
    if (isCommonEmailProvider(domain)) {
      setAddAllowedDomainErrorMessage(
        "Common email providers are not allowed."
      );
      return;
    }
    // check if domain is already in allowedDomains
    const isDomainAlreadyAllowed = currentWorkspace.allowedDomains.find(
      (allowedDomain: any) => allowedDomain.domain === domain
    );
    if (isDomainAlreadyAllowed) {
      setAddAllowedDomainErrorMessage("Domain is already allowed.");
      return;
    }
    try {
      const jwt = await getToken({ template: "test" });
      const response = await updateWorkspaceMutation.mutateAsync({
        workspaceId: currentWorkspace.id,
        workspaceData: {
          allowedDomains: [
            ...currentWorkspace.allowedDomains,
            {
              id: uuidv4(),
              domain: domain,
            },
          ],
        },
        jwt,
      });
      if (response) {
        closeAddAllowedDomainDialog();
      }
    } catch (error) {
      console.error("Error deleting workspace:", error);
    }
  };

  const [isInvitePeopleDialogOpen, setIsInvitePeopleDialogOpen] =
    useState(false);
  const [isAddAllowedDomainDialogOpen, setIsAddAllowedDomainDialogOpen] =
    useState(false);
  const [addAllowedDomainErrorMessage, setAddAllowedDomainErrorMessage] =
    useState("");

  const [allowedDomainInput, setAllowedDomainInput] = useState("");

  const openAddAllowedDomainDialog = () => {
    setIsAddAllowedDomainDialogOpen(true);
  };

  const closeAddAllowedDomainDialog = () => {
    setIsAddAllowedDomainDialogOpen(false);
  };

  if (isUserLoading || isWorkspaceLoading || isMembershipsLoading) {
    return <div className="h-screen bg-slate-1"></div>;
  }

  if (userError || workspaceError || membershipsError) {
    return <div>Error: {JSON.stringify(userError)}</div>;
  }

  return (
    <>
      <Head>
        <title>{currentWorkspace.name} › Members</title>
      </Head>
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
                <div className="flex flex-col grow">
                  <div className="items-start text-left text-[16px] pb-[16px] border-b border-slate-4 w-full">
                    Members
                  </div>
                  <div className="text-[14px] flex flex-col gap-2 mt-4">
                    <div className="flex flex-row gap-4 items-end">
                      <div className="flex flex-col gap-2">
                        <p>Allowed domains</p>
                        <p className="text-slate-11 text-[13px]">
                          Anyone from these domains can join this workspace
                          without an invite
                        </p>
                      </div>
                      {currentUserMembership?.role == "admin" && (
                        <div
                          className="bg-blue-600 hover:bg-blue-700 text-[13px] px-[12px] py-[6px] h-[32px] border border-slate-4 cursor-pointer rounded-[6px] ml-auto"
                          onClick={openAddAllowedDomainDialog}
                        >
                          <p>Add allowed domain</p>
                        </div>
                      )}
                      <Dialog
                        as="div"
                        open={isAddAllowedDomainDialogOpen}
                        onClose={() => setIsAddAllowedDomainDialogOpen(false)}
                        className="absolute inset-0 flex min-w-full h-screen"
                      >
                        <Dialog.Overlay>
                          <div className="fixed inset-0 bg-slate-1 opacity-50" />
                        </Dialog.Overlay>
                        <Dialog.Panel className="absolute z-30 top-[25%] left-[50%] translate-x-[-50%] translate-y-[-25%] w-[400px]">
                          <div className="flex flex-col bg-slate-2 border border-slate-4 rounded-[8px] w-full p-[24px] text-slate-12">
                            {/* Close */}
                            <div className="rounded-[4px] text-[13px] absolute right-[16px] top-[16px] z-40">
                              <button
                                onClick={() => {
                                  closeAddAllowedDomainDialog();
                                }}
                                className="text-slate-11 hover:bg-slate-4 rounded-md h-[24px] w-[24px] ml-[12px] flex items-center justify-center"
                              >
                                <X size={16} />
                              </button>
                            </div>
                            <Dialog.Title className="text-[14px]">
                              Add allowed domain
                            </Dialog.Title>
                            <Dialog.Description className="text-[13px] mt-[16px] gap-0 flex flex-col">
                              <input
                                type={"text"}
                                id="workspaceNameInput"
                                value={allowedDomainInput}
                                onChange={(e) =>
                                  setAllowedDomainInput(e.target.value)
                                }
                                placeholder="i.e. acme.com"
                                className={`bg-slate-3 border text-slate-12 text-[14px] rounded-md px-3 py-2 placeholder-slate-9 w-full
                                ${
                                  addAllowedDomainErrorMessage !== ""
                                    ? "border-red-9"
                                    : "border-slate-6"
                                }
                                focus:outline-none focus:ring-blue-600
                                `}
                              />
                              {addAllowedDomainErrorMessage && (
                                <div className="text-red-9 text-[13px] mt-[12px]">
                                  {addAllowedDomainErrorMessage}
                                </div>
                              )}
                            </Dialog.Description>
                            <div className="flex w-full justify-end mt-[24px] gap-2">
                              <button
                                className="ml-auto bg-slate-3 hover:bg-slate-4 text-[13px] text-slate-12 px-[12px] py-[4px] rounded-[4px]"
                                onClick={() => {
                                  closeAddAllowedDomainDialog();
                                }}
                              >
                                Cancel
                              </button>
                              <button
                                className="bg-blue-600 hover:bg-blue-700 text-[13px] px-[12px] py-[6px] h-[32px] border border-slate-4 cursor-pointer rounded-[6px]"
                                onClick={() => {
                                  handleAddAllowedDomain(allowedDomainInput);
                                }}
                              >
                                Add domain
                              </button>
                            </div>
                          </div>
                        </Dialog.Panel>
                      </Dialog>
                    </div>
                    <div className="flex flex-col border-slate-4 rounded-lg border mt-2">
                      {currentWorkspace.allowedDomains.length > 0 &&
                        currentWorkspace.allowedDomains?.map(
                          (allowedDomain: any, index: number) => {
                            let borderClasses = "";

                            if (currentWorkspace.allowedDomains.length > 1) {
                              borderClasses = `${
                                index === 0
                                  ? "rounded-tl-lg rounded-tr-lg border-b border-slate-4"
                                  : ""
                              }                                 
                              ${
                                index <
                                  currentWorkspace.allowedDomains.length - 1 &&
                                index > 0
                                  ? "border-b border-slate-4"
                                  : ""
                              } 
                              ${
                                index ===
                                currentWorkspace.allowedDomains.length - 1
                                  ? "rounded-bl-lg rounded-br-lg"
                                  : ""
                              }`;
                            } else {
                              borderClasses = "rounded-lg";
                            }

                            return (
                              <div
                                key={allowedDomain.id}
                                className={`flex flex-row gap-4 items-center ${borderClasses} text-[13px] pl-[16px] pr-[20px] py-[12px] bg-slate-1 text-slate-12`}
                              >
                                <div className="h-[24px] w-[24px] text-[12px] font-semibold rounded-full flex items-center justify-center text-slate-10">
                                  <Globe size={20} />
                                </div>
                                <div className="grow truncate">
                                  {allowedDomain.domain && (
                                    <div key={allowedDomain.id}>
                                      {allowedDomain.domain}
                                    </div>
                                  )}
                                </div>
                                {currentUserMembership?.role == "admin" && (
                                  <div
                                    className="h-[24px] w-[24px] flex items-center justify-center mr-[8px] hover:bg-slate-3 cursor-pointer rounded-md"
                                    onClick={() =>
                                      handleRemoveAllowedDomain(
                                        allowedDomain.id
                                      )
                                    }
                                  >
                                    <Trash
                                      size={16}
                                      className="text-slate-11"
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          }
                        )}
                      {currentWorkspace.allowedDomains.length === 0 && (
                        <div className="flex flex-row gap-4 items-center text-[13px] pl-[16px] pr-[20px] py-[12px] bg-slate-2 justify-center text-slate-11 h-[96px]">
                          No allowed domains yet
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 mt-8">
                    <div className="flex flex-row gap-4 items-end">
                      <div className="flex flex-col gap-2">
                        <p className="text-[14px]">Members</p>
                        <p className="text-slate-11 text-[13px]">
                          Manage who can access this workspace
                        </p>
                      </div>
                      <div
                        className="bg-blue-600 hover:bg-blue-700 text-[13px] px-[12px] py-[6px] h-[32px] border border-slate-4 cursor-pointer rounded-[6px] ml-auto"
                        onClick={() => {
                          setIsInvitePeopleDialogOpen(true);
                        }}
                      >
                        <p>Invite people</p>
                      </div>
                      <InvitePeopleDialog
                        isInvitePeopleDialogOpen={isInvitePeopleDialogOpen}
                        setIsInvitePeopleDialogOpen={
                          setIsInvitePeopleDialogOpen
                        }
                        currentUser={currentUser}
                        currentWorkspace={currentWorkspace}
                        customMessage={customMessage}
                        setCustomMessage={setCustomMessage}
                        emailTemplateLanguage={""}
                      />
                    </div>
                    <div className="flex flex-col border-slate-4 rounded-lg border">
                      {membershipsData.length > 0 &&
                        membershipsData.map(
                          (membership: any, index: number) => {
                            const user = getUserFromMembership(membership);

                            if (!user) {
                              return null;
                            }

                            let borderClasses = "";

                            if (membershipsData.length > 1) {
                              borderClasses = `${
                                index === 0
                                  ? "rounded-tl-lg rounded-tr-lg border-b border-slate-4"
                                  : ""
                              }                                 
                            ${
                              index < membershipsData.length - 1 && index > 0
                                ? "border-b border-slate-4"
                                : ""
                            } 
                            ${
                              index === membershipsData.length - 1
                                ? "rounded-bl-lg rounded-br-lg"
                                : ""
                            }`;
                            } else {
                              borderClasses = "rounded-lg";
                            }

                            return (
                              <div
                                key={membership.id}
                                className={`
                              flex flex-row gap-4 items-center ${borderClasses} text-[13px] pl-[16px] pr-[20px] py-[12px] bg-slate-1 text-slate-12`}
                              >
                                <div className="bg-purple-8 h-[32px] w-[32px] text-[12px] font-semibold rounded-full flex items-center justify-center">
                                  {user.name ? (
                                    <div key={user.id}>
                                      {getInitials(user?.name)}
                                    </div>
                                  ) : (
                                    <div key={user.id}>
                                      {getInitials(user?.email?.split("@")[0])}
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col gap-0 w-[320px] truncate">
                                  <div className="truncate">
                                    {user.name ? (
                                      <div key={user.id} className="truncate">
                                        {user.name}
                                      </div>
                                    ) : (
                                      <div key={user.id} className="truncate">
                                        {capitalizeString(
                                          user.email?.split("@")[0]
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <div
                                    key={user.id}
                                    className="text-slate-11 truncate"
                                  >
                                    {user.email}
                                  </div>
                                </div>
                                <div className="ml-4 text-slate-12">
                                  <MemberRolePopover
                                    currentUser={currentUser}
                                    currentUserMembership={
                                      currentUserMembership
                                    }
                                    targetUserMembership={membership}
                                    memberships={membershipsData}
                                  />
                                </div>
                                <div className="ml-auto text-left text-slate-11">
                                  <MemberPopover
                                    currentUser={currentUser}
                                    currentUserMembership={
                                      currentUserMembership
                                    }
                                    targetMembership={membership}
                                  />
                                </div>
                              </div>
                            );
                          }
                        )}
                      {workspaceInvitesData &&
                        workspaceInvitesData.length > 0 &&
                        workspaceInvitesData.map(
                          (workspaceInvite: any, index: number) => {
                            return (
                              <div
                                className="flex flex-row gap-4 items-center text-[13px] pl-[16px] pr-[20px] py-[12px] bg-slate-1 text-slate-12 border-t border-slate-4"
                                key={index}
                              >
                                <div className="bg-purple-5 border border-purple-11 border-dashed opacity-50 h-[32px] w-[32px] text-[12px] font-semibold rounded-full flex items-center justify-center">
                                  <div key={workspaceInvite.recipientEmail}>
                                    {getInitials(
                                      workspaceInvite.recipientEmail?.split(
                                        "@"
                                      )[0]
                                    )}
                                  </div>
                                </div>
                                <div className="w-[320px] truncate">
                                  <div className="truncate text-slate-12">
                                    {workspaceInvite.recipientEmail}
                                  </div>
                                </div>
                                <div className="ml-[24px] flex flex-row items-center gap-3">
                                  <p>Member</p>
                                  <div className="truncate text-slate-11 bg-slate-4 rounded-md text-[12px] tracking-wide px-[6px] py-[3px] ">
                                    Pending
                                  </div>
                                </div>
                                <div className="ml-auto text-left text-slate-11">
                                  <InvitePopover
                                    currentWorkspace={currentWorkspace}
                                    workspaceInvite={workspaceInvite}
                                  />
                                </div>
                              </div>
                            );
                          }
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </WorkspaceLayout>
    </>
  );
}
