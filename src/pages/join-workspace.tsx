import React, { useState, useEffect } from "react";
import Link from "next/link";
import router from "next/router";
import Image from "next/image";
import { useCurrentUser } from "../hooks/useCurrentUser";
import {
  useQueryClient,
  useQuery,
  useQueries,
  useMutation,
} from "@tanstack/react-query";
import {
  getInvitesForUserEmail,
  getWorkspaceDetails,
  getAllowedWorkspacesForUser,
  createMembership,
  acceptWorkspaceInvite,
} from "../utils/api";
import { stringToVibrantColor, generateWorkspaceIcon } from "../utils/util";
import { CaretRight, UsersThree } from "@phosphor-icons/react";
import { AccountHeader } from "@/components/AccountHeader";
import { useAuth } from "@clerk/nextjs";

export default function JoinWorkspace() {
  const handleAcceptInvite = async ({
    user,
    workspace,
    invite,
  }: {
    user: any;
    workspace: any;
    invite: any;
  }) => {
    // create a membership between the user and the workspace
    const createMembershipRequestBody = {
      userId: user?.id,
      workspaceId: workspace.id,
      createdAt: new Date().toISOString(),
      role: "member", // since they're the creator
    };

    try {
      const jwt = await getToken({ template: "test" });
      const created_membership_result = await createMembership(
        createMembershipRequestBody,
        jwt
      );

      try {
        // accept the invite
        const jwt = await getToken({ template: "test" });
        const delete_invite_result = await acceptWorkspaceInvite({
          workspaceId: workspace.id,
          inviteId: invite.id,
          jwt,
        });

        router.push(`/workspace/${workspace.id}`);
      } catch (e) {
        console.error(e);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleJoinWorkspaceFromAllowedDomain = async ({
    user,
    workspace,
  }: {
    user: any;
    workspace: any;
  }) => {
    // create a membership between the user and the workspace
    const createMembershipRequestBody = {
      userId: user?.id,
      workspaceId: workspace.id,
      createdAt: new Date().toISOString(),
      role: "member", // since they're the creator
    };

    try {
      const jwt = await getToken({ template: "test" });
      const created_membership_result = await createMembership(
        createMembershipRequestBody,
        jwt
      );
      router.push(`/workspace/${workspace.id}`);
    } catch (e) {
      console.error(e);
    }
  };
  const { getToken } = useAuth();

  const {
    data: currentUser,
    isLoading: isUserLoading,
    error: userError,
  } = useCurrentUser();

  const invitesQuery = useQuery({
    queryKey: ["invites", currentUser?.email],
    enabled: currentUser?.email != null,
    queryFn: async () => {
      const token = await getToken({ template: "test" });
      const result = await getInvitesForUserEmail(currentUser.email, token);
      console.log("invitesQuery result", result);
      return result;
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
      queryFn: async () => {
        const response = await getWorkspaceDetails(id);
        return response;
      },
    })),
  });

  const {
    data: allowedWorkspacesForUser,
    isLoading: isAllowedWorkspacesForUserLoading,
    error: allowedWorkspacesForUserError,
  } = useQuery({
    queryKey: ["getAllowedWorkspacesForUser", currentUser?.id],
    queryFn: async () => {
      const result = await getAllowedWorkspacesForUser(currentUser?.id);
      return result;
    },
    enabled: currentUser?.id != null,
  });

  // if any of workspacesQuery[0].isLoading, workspacesQuery[1].isLoading, etc. is true, then isLoading is true
  const isWorkspacesQueriesLoading = workspacesQuery.some(
    (query) => query.isLoading
  );
  const isWorkspacesQueriesError = workspacesQuery.some((query) => query.error);

  if (
    isUserLoading ||
    invitesQuery.isLoading ||
    isWorkspacesQueriesLoading ||
    isAllowedWorkspacesForUserLoading
  ) {
    return <div className="h-screen bg-slate-1 text-slate-12"></div>;
  }

  if (
    userError ||
    invitesQuery.error ||
    isWorkspacesQueriesError ||
    allowedWorkspacesForUserError
  ) {
    return (
      <div className="text-slate-12">
        Error: {JSON.stringify(userError)} invitesQuery error:{" "}
        {JSON.stringify(invitesQuery.error)}
      </div>
    );
  }

  const email = currentUser.email;

  return (
    <div className="h-screen bg-slate-1">
      <AccountHeader email={email ?? "placeholder@example.com"} />
      <div className="flex flex-col justify-center items-center w-full pt-12 bg-slate-1 pb-32">
        <div className="bg-slate-1 text-slate-12 text-center text-[22px] pb-4">
          Join a workspace
        </div>
        {invitesQuery.data && invitesQuery.data.length > 0 && (
          <div className="text-slate-12 flex flex-col gap-4 rounded-md mt-4">
            {/* map through invitesQuery.data */}
            {invitesQuery.data.map((invite: any) => {
              console.log("invite", invite);
              if (invite.accepted === true) {
                return;
              }
              // Find the corresponding workspace detail
              const workspaceDetail = workspacesQuery.find(
                (query: any) =>
                  query.data && query.data.id === invite.workspaceId
              )?.data;

              return (
                <>
                  <div
                    key={invite.id}
                    onClick={() =>
                      handleAcceptInvite({
                        user: currentUser,
                        workspace: workspaceDetail,
                        invite,
                      })
                    }
                  >
                    <div className="text-slate-12 text-center text-[14px] flex flex-row gap-4 p-4 items-center bg-slate-2 hover:bg-slate-3 rounded-md cursor-pointer">
                      <div
                        className={`h-[48px] w-[48px] flex items-center justify-center text-[18px] rounded-md`}
                        style={{
                          backgroundImage: `url(${
                            workspaceDetail?.customWorkspaceBase64Icon
                              ? workspaceDetail?.customWorkspaceBase64Icon
                              : workspaceDetail?.iconUrl
                          })`,
                          backgroundSize: "cover",
                        }}
                      >
                        {!workspaceDetail?.customWorkspaceBase64Icon &&
                          workspaceDetail.name.slice(0, 1)}
                      </div>
                      <div className="flex flex-col text-left gap-1">
                        <p className="truncate w-[240px]">
                          {workspaceDetail
                            ? workspaceDetail.name
                            : invite.workspaceId}
                        </p>
                        <p className="truncate w-[240px] text-slate-11">
                          Invited by {invite.inviterEmail}
                        </p>
                      </div>
                      <div>
                        <CaretRight size={16} />
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        )}
        {allowedWorkspacesForUser.length > 0 && (
          <>
            <div className="text-slate-12 flex flex-col gap-4 rounded-md mt-4">
              {allowedWorkspacesForUser.map((workspace: any) => {
                return (
                  <div
                    key={workspace.id}
                    onClick={() =>
                      handleJoinWorkspaceFromAllowedDomain({
                        user: currentUser,
                        workspace,
                      })
                    }
                  >
                    <div className="text-slate-12 text-center text-[14px] flex flex-row gap-4 p-4 items-center bg-slate-2 hover:bg-slate-3 rounded-md cursor-pointer">
                      <div
                        className={`h-[48px] w-[48px] flex items-center justify-center text-[18px] rounded-md`}
                        style={{
                          backgroundImage: `url(${
                            workspace?.customWorkspaceBase64Icon
                              ? workspace?.customWorkspaceBase64Icon
                              : workspace?.iconUrl
                          })`,
                          backgroundSize: "cover",
                        }}
                      >
                        {!workspace?.customWorkspaceBase64Icon &&
                          workspace.name.slice(0, 1)}
                      </div>
                      <div className="flex flex-col text-left gap-1">
                        <p className="truncate w-[240px]">{workspace.name}</p>
                        <p className="truncate w-[240px] text-slate-11">
                          Anyone {`@${currentUser.email.split("@")[1]}`} can
                          join
                        </p>
                      </div>
                      <div>
                        <CaretRight size={16} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
        {invitesQuery.data &&
          invitesQuery.data.length == 0 &&
          allowedWorkspacesForUser.length == 0 && (
            <div className="text-slate-12 text-center text-[14px] mt-8 py-8 px-8 items-center justify-center bg-slate-2 border border-slate-3 rounded-md flex flex-col gap-4">
              <UsersThree
                size={48}
                weight="duotone"
                className="text-slate-11"
              />
              <p className="text-[18px]">No invites yet</p>
              <p className="text-slate-11 max-w-[320px]">
                Not seeing an invite that you&apos;re expecting? You may need to
                log into a different account.
              </p>
            </div>
          )}
        <div className="text-blue-500 text-center text-[14px] mt-12">
          <Link href="/welcome/create-workspace">Create a new workspace →</Link>
        </div>
      </div>
    </div>
  );
}
