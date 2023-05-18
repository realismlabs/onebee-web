import React, { useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import router from "next/router";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { motion } from "framer-motion";
import { Check, CircleNotch } from "@phosphor-icons/react";
import { capitalizeString } from "@/utils/util";
import { AccountHeader } from "@/components/AccountHeader";
import { getUserMemberships, getWorkspace } from "../utils/api";
import { useCurrentWorkspace } from "@/hooks/useCurrentWorkspace";
import { useRouter } from "next/router";
import { useQuery, useQueries } from "@tanstack/react-query";

export default function Welcome() {
  const router = useRouter();

  const {
    data: currentUser,
    isLoading: isUserLoading,
    error: userError,
  } = useCurrentUser();

  // get user's current memberships
  const {
    data: userMembershipsData,
    isLoading: isUserMembershipsLoading,
    error: userMembershipsError,
  } = useQuery({
    queryKey: ["currentUserMemberships", currentUser?.id],
    queryFn: async () => {
      return await getUserMemberships(currentUser?.id);
    },
    enabled: currentUser?.id !== null,
  });

  //  fetch user data for each membership
  const currentWorkspacesForUserQueries = useQueries({
    queries: (userMembershipsData ?? []).map((membership: any) => {
      return {
        queryKey: ["getWorkspace", membership?.workspaceId],
        queryFn: async () => {
          const response = await getWorkspace(membership?.workspaceId);
          if (response) {
            return response;
          } else {
            return null;
          }
        },
        enabled: membership?.workspaceId !== null,
      };
    }),
  });

  const currentWorkspacesForUserData = currentWorkspacesForUserQueries.map(
    (workspace: any) => {
      if (workspace.data == null) {
        return null;
      } else {
        return workspace.data;
      }
    }
  );
  const currentWorkspacesForUserError = currentWorkspacesForUserQueries.map(
    (workspace: any) => workspace.error
  );
  const currentWorkspacesForUserIsLoading = currentWorkspacesForUserQueries.map(
    (workspace: any) => workspace.isLoading
  );

  // watch currentWorkspacesForUserData for changes
  // If it's not null and there's >=1 workspace, redirect to the first workspace
  useEffect(() => {
    // route to first workspace if there are workspaces
    if (
      currentWorkspacesForUserData &&
      currentWorkspacesForUserData.length >= 1 &&
      currentWorkspacesForUserData[0] !== null
    ) {
      console.log(
        "awu: currentWorkspacesForUserData",
        currentWorkspacesForUserData
      );
      router.push(`/workspace/${currentWorkspacesForUserData[0].id}`);
    }

    //  route to /welcome if there are no workspaces
    if (
      currentWorkspacesForUserData &&
      currentWorkspacesForUserData.length == 0
    ) {
      router.push(`/welcome`);
    }
  }, [currentWorkspacesForUserData, router]);

  if (
    isUserLoading ||
    currentWorkspacesForUserIsLoading.some((isLoading) => isLoading)
  ) {
    return <div className="h-screen bg-slate-1">Hi</div>;
  }

  if (userError || currentWorkspacesForUserError.some((error) => error)) {
    return <div>Error: {JSON.stringify(userError)}</div>;
  }

  const email = currentUser.email;

  return (
    <div className="h-screen bg-slate-1 z-10 relative text-white flex items-center justify-center">
      <div className="animate-spin">
        <CircleNotch width={16} height={16} />
      </div>
      {/* <AccountHeader email={email} />
      <div className="w-full flex flex-col items-center justify-center">
        <div>Workspaces</div>
        <div className="px-[16px] pt-[13px] pb-[4px] text-slate-11 text-[13px]">
          {currentUser.email}
        </div>
        <div className="max-h-[60vh] overflow-y-scroll flex flex-col">
          {(currentWorkspacesForUserData ?? []).map((workspace: any) => (
            <button key={workspace.id}>
              <div
                onClick={(e) => {
                  router.push(`/workspace/${workspace.id}`);
                }}
                className="flex w-full"
              >
                <div className="px-[8px] text-[13px] cursor-pointer flex w-full">
                  <div className="hover:bg-slate-4 px-[8px] py-[8px] text-left flex flex-row gap-3 rounded-md items-center w-full">
                    <div
                      className={`flex-none h-[24px] w-[24px] flex items-center justify-center text-[18px] rounded-sm`}
                      style={{
                        backgroundImage: `url(${workspace.iconUrl})`,
                        backgroundSize: "cover",
                      }}
                    >
                      <div className="text-[10px] text-slate-12">
                        {workspace?.name?.slice(0, 1)}
                      </div>
                    </div>
                    <div className="grow truncate">{workspace.name}</div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div> */}
    </div>
  );
}
