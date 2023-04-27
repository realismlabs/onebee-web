import React, { useState, useEffect } from "react";
import Link from "next/link";
import router from "next/router";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useQuery, useQueries } from "@tanstack/react-query";
import { getInvitesForUserEmail, getWorkspaceDetails } from "../utils/api";

interface AccountHeaderProps {
  email: string;
}

const AccountHeader: React.FC<AccountHeaderProps> = ({ email }) => {
  const handleLogout = () => {
    router.push("/login?lo=true");
  };

  return (
    <div className="w-full flex flex-row h-16 items-center p-12 bg-slate-1">
      <div className="flex flex-col grow items-start">
        <p className="text-xs text-slate-11 mb-1">Logged in as:</p>
        <p className="text-xs text-white font-medium">{email}</p>
      </div>
      <div className="flex flex-col grow items-end">
        <p
          className="text-xs text-white hover:text-slate-12 font-medium cursor-pointer"
          onClick={handleLogout}
        >
          Logout
        </p>
      </div>
    </div>
  );
};

export default function JoinWorkspace() {
  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  const {
    data: currentUser,
    isLoading: isUserLoading,
    error: userError,
  } = useCurrentUser();

  console.log("currentUser", currentUser);

  const invitesQuery = useQuery({
    queryKey: ["invites", currentUser?.email],
    enabled: currentUser?.email != null,
    queryFn: () => {
      console.log("starting query");
      return getInvitesForUserEmail(currentUser.email);
    },
    staleTime: 1000, // 1 second
  });

  const workspaceIds = invitesQuery.data
    ? Array.from(
        new Set(invitesQuery.data.map((invite: any) => invite.workspaceId))
      )
    : [];

  // Fetch workspace details for each workspaceId
  const workspacesQuery = useQueries({
    queries: workspaceIds.map((id) => ({
      queryKey: ["workspace", id],
      queryFn: () => getWorkspaceDetails(id),
    })),
  });

  if (isUserLoading || invitesQuery.isLoading) {
    return <div className="h-screen bg-slate-1 text-white">Loading</div>;
  }

  if (userError || invitesQuery.error) {
    return (
      <div>
        Error: {JSON.stringify(userError)} invitesQuery error:{" "}
        {JSON.stringify(invitesQuery.error)}
      </div>
    );
  }

  const email = currentUser.email;

  return (
    <div className="h-screen bg-slate-1">
      <AccountHeader email={email ?? "placeholder@example.com"} />
      <div className="flex flex-col justify-center items-center w-full pt-32">
        <div className="bg-slate-1 text-white text-center text-[22px] pb-4">
          Join a workspace
        </div>
        <div className="text-white">
          {/* map through invitesQuery.data */}
          {invitesQuery.data?.map((invite: any) => {
            console.log("invite", invite);
            if (invite.accepted === true) {
              // skip
              return;
            }
            // Find the corresponding workspace detail
            const workspaceDetail = workspacesQuery.find(
              (query: any) => query.data && query.data.id === invite.workspaceId
            )?.data;

            return (
              <div key={invite.id}>
                <div className="text-white text-center text-[18px] pt-4">
                  {invite.inviter_email} invited you to join{" "}
                  {workspaceDetail ? workspaceDetail.name : invite.workspaceId}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
