import React, { useEffect, useState, useRef, useMemo } from "react";
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

  const currentWorkspacesForUserError = currentWorkspacesForUserQueries.map(
    (workspace: any) => workspace.error
  );
  const currentWorkspacesForUserIsLoading = currentWorkspacesForUserQueries.map(
    (workspace: any) => workspace.isLoading
  );

  const currentWorkspacesForUserData = currentWorkspacesForUserQueries.map(
    (workspace: any) => workspace.data
  );

  const currentWorkspacesIdsForUser = currentWorkspacesForUserData.map(
    (workspace: any) => workspace?.id
  );

  // ------------------------------------------------------------------
  // Check if there are any loading states or errors
  const isLoading =
    isUserLoading ||
    currentWorkspacesForUserIsLoading.some((isLoading) => isLoading);
  const isError =
    userError || currentWorkspacesForUserError.some((error) => error);

  useEffect(() => {
    let next_route = null;

    // Only set next_route if there are no errors and loading has completed
    if (!isLoading && !isError) {
      if (currentWorkspacesIdsForUser.length > 0) {
        next_route = `/workspace/${currentWorkspacesIdsForUser[0]}`;
      } else {
        next_route = `/welcome`;
      }

      router.push(next_route);
    }
  }, [isLoading, isError, currentWorkspacesIdsForUser, router]);
  // ------------------------------------------------------------------

  if (isLoading) {
    return <div className="h-screen bg-slate-1">Hi</div>;
  }

  if (isError) {
    return <div>Error: {JSON.stringify(userError)}</div>;
  }

  return (
    <div className="h-screen bg-slate-1 z-10 relative text-white flex items-center justify-center">
      {/* {next_route} */}
      {/* JSX that automatically routes user to next_route */}
      {/* <div className="animate-spin">
        <CircleNotch width={16} height={16} />
      </div> */}
    </div>
  );
}
