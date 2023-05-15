import React, { useState, useEffect, Fragment } from "react";
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
  deleteMembership,
} from "@/utils/api";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useQueries,
} from "@tanstack/react-query";
import WorkspaceLayout from "@/components/WorkspaceLayout";
import { Globe, X, DotsThree, Trash } from "@phosphor-icons/react";
import { Dialog, Popover, Transition } from "@headlessui/react";
import {
  capitalizeString,
  friendlyRelativeDateToNow,
  getInitials,
} from "@/utils/util";

const MemberPopover = ({
  currentUser,
  membership,
}: {
  currentUser: any;
  membership: any;
}) => {
  const membershipId = membership.id;
  const userId = membership.userId;
  const workspaceId = membership.workspaceId;

  const handleRemoveMember = async () => {
    const deletedMember = await deleteMembershipMutation.mutateAsync({
      membershipId,
    });
  };

  const queryClient = useQueryClient();

  const deleteMembershipMutation = useMutation(deleteMembership, {
    onSuccess: async (updatedMemberships) => {
      console.log("Memberships updated:", updatedMemberships);
      if (userId === currentUser?.id) {
        console.log("TODO: User is deleting their own membership");
        router.push("/login");
      } else {
        console.log("Refetching memberships:", userId);
        await queryClient.refetchQueries([
          "getWorkspaceMemberships",
          workspaceId,
        ]);
      }
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
                        className="hover:bg-slate-4 px-[8px] py-[6px] text-left flex flex-row gap-3 w-full rounded-md items-center"
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
};

export default function Settings() {
  const queryClient = useQueryClient();

  // get router path - foramt is /workspace/6/settings/members, need to grab everything after /settings/
  const router = useRouter();
  const routerPath = router.asPath;

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

  const getUserFromMembership = (membership: any) => {
    return usersData.find((user) => user.id === membership.userId);
  };

  if (isUserLoading || isWorkspaceLoading || isMembershipsLoading) {
    return <div className="h-screen bg-slate-1"></div>;
  }

  if (userError || workspaceError || membershipsError) {
    return <div>Error: {JSON.stringify(userError)}</div>;
  }

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
                <div className="text-[14px] flex flex-col gap-2 mt-4">
                  <div className="flex flex-row gap-4 items-end">
                    <div className="flex flex-col gap-2">
                      <p>Allowed domains</p>
                      <p className="text-slate-11 text-[13px]">
                        Anyone from these domains is allowed to join this
                        workspace
                      </p>
                    </div>
                    <div className="bg-blue-600 hover:bg-blue-700 text-[13px] px-[12px] py-[6px] h-[32px] border border-slate-4 cursor-pointer rounded-[6px] ml-auto">
                      <p>Add allowed domain</p>
                    </div>
                  </div>
                  <div className="flex flex-col border-slate-4 rounded-lg border mt-2">
                    {currentWorkspace.allowedDomains.length > 0 &&
                      currentWorkspace.allowedDomains?.map(
                        (allowedDomain: any, index: number) => {
                          return (
                            <div
                              key={allowedDomain.id}
                              className={`flex flex-row gap-4 items-center ${
                                index <
                                currentWorkspace.allowedDomains.length - 1
                                  ? "border-b border-slate-4"
                                  : ""
                              } text-[13px] pl-[16px] pr-[20px] py-[12px] bg-slate-1 text-slate-12`}
                            >
                              <div className="h-[24px] w-[24px] text-[10px] font-semibold rounded-full flex items-center justify-center text-slate-10">
                                <Globe size={20} />
                              </div>
                              <div className="w-[240px] truncate">
                                {allowedDomain.domain && (
                                  <div key={allowedDomain.id}>
                                    {allowedDomain.domain}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        }
                      )}
                    {currentWorkspace.allowedDomains.length === 0 && (
                      <div className="flex flex-row gap-4 items-center text-[13px] pl-[16px] pr-[20px] py-[12px] bg-slate-2 justify-center text-slate-11 h-[64px]">
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
                    <div className="bg-blue-600 hover:bg-blue-700 text-[13px] px-[12px] py-[6px] h-[32px] border border-slate-4 cursor-pointer rounded-[6px] ml-auto">
                      <p>Invite people</p>
                    </div>
                  </div>
                  <div className="flex flex-col border-slate-4 rounded-lg border">
                    {membershipsData.length > 0 &&
                      membershipsData.map((membership: any, index: number) => {
                        const user = getUserFromMembership(membership);
                        return (
                          <div
                            key={membership.id}
                            className={`flex flex-row gap-4 items-center ${
                              index < membershipsData.length - 1
                                ? "border-b border-slate-4"
                                : ""
                            } text-[13px] pl-[16px] pr-[20px] py-[12px] bg-slate-1 text-slate-12`}
                          >
                            <div className="bg-purple-8 h-[24px] w-[24px] text-[10px] font-semibold rounded-full flex items-center justify-center">
                              {user.name ? (
                                <div key={user.id}>
                                  {getInitials(user.name)}
                                </div>
                              ) : (
                                <div key={user.id}>
                                  {getInitials(user.email?.split("@")[0])}
                                </div>
                              )}
                            </div>
                            <div className="w-[240px] truncate">
                              {user.name ? (
                                <div key={user.id} className="truncate">
                                  {user.name}
                                </div>
                              ) : (
                                <div key={user.id} className="truncate">
                                  {capitalizeString(user.email?.split("@")[0])}
                                </div>
                              )}
                            </div>
                            <div className="w-[240px] truncate text-slate-11">
                              {user && (
                                <div key={user.id} className="truncate">
                                  {user.email}
                                </div>
                              )}
                            </div>
                            <div className="ml-auto text-left text-slate-11">
                              <MemberPopover
                                currentUser={currentUser}
                                membership={membership}
                              />
                            </div>
                          </div>
                        );
                      })}
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
