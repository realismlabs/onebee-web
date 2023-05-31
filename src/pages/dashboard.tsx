import React, { useEffect, useState, useRef, useMemo } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getUserMemberships, getWorkspaceDetails } from "../utils/api";
import { useRouter } from "next/router";
import { useQuery, useQueries } from "@tanstack/react-query";
import { useUser, useAuth } from "@clerk/nextjs";
import Head from "next/head";

// This is the default page a user lands on after logging in via Clerk.
// To change the destination in Clerk, you need to edit the paths .env.local in local dev mode.
// In production, you need to edit the paths in the Clerk dashboard.

export default function Welcome() {
  const { getToken } = useAuth();
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
      const jwt = await getToken({ template: "test" });
      const result = await getUserMemberships(currentUser?.id, jwt);
      return result;
    },
    enabled: !!currentUser?.id,
  });

  console.log("userMembershipsData", userMembershipsData);
  const currentWorkspacesForUserQueries = useQueries({
    queries: Array.isArray(userMembershipsData)
      ? userMembershipsData.map((membership: any) => {
          return {
            queryKey: ["getWorkspace", membership?.workspaceId],
            queryFn: async () => {
              const response = await getWorkspaceDetails(
                membership?.workspaceId
              );
              if (response) {
                return response;
              } else {
                throw new Error("No response from server");
              }
            },
            onError: (error: any) => {
              console.error("Error fetching workspace details:", error);
            },
            enabled: !!membership?.workspaceId,
          };
        })
      : [],
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

    // Only set next_route if userMembershipsData is not null or undefined
    if (!!userMembershipsData && Array.isArray(currentWorkspacesIdsForUser)) {
      if (
        currentWorkspacesIdsForUser.length > 0 &&
        !!currentWorkspacesIdsForUser[0]
      ) {
        next_route = `/workspace/${currentWorkspacesIdsForUser[0]}`;
      } else if (currentWorkspacesIdsForUser.length === 0) {
        next_route = `/welcome`;
      }
      if (next_route) {
        router.push(next_route);
      }
    }
  }, [userMembershipsData, currentWorkspacesIdsForUser, router]);
  // ------------------------------------------------------------------

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Dataland</title>
        </Head>
        <div className="h-screen bg-slate-1">Hi</div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Head>
          <title>Dataland</title>
        </Head>
        <div>Error: {JSON.stringify(userError)}</div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Dataland</title>
      </Head>
      <div className="h-screen bg-slate-1 z-10 relative text-white flex items-center justify-center">
        {/* Intentionally blank for good UX */}
      </div>
    </>
  );
}
