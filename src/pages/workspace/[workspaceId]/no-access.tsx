import React, { useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import router from "next/router";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { motion } from "framer-motion";
import { CaretRight } from "@phosphor-icons/react";
import { capitalizeString } from "@/utils/util";
import { v4 as uuidv4 } from "uuid";
import { useQueries, useQuery } from "@tanstack/react-query";
import {
  getInvitesForUserEmail,
  getWorkspaceDetails,
  getAllowedWorkspacesForUser,
  createMembership,
  acceptWorkspaceInvite,
} from "@/utils/api";
import { AccountHeader } from "@/components/AccountHeader";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";

export default function NoAccess() {
  const router = useRouter();
  const { workspaceId } = router.query;
  const workspaceId_as_number = parseInt(workspaceId as string);
  const { getToken } = useAuth();

  // clerk
  const { isLoaded: isLoadedClerkUser, user } = useUser();

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

  const {
    data: currentUser,
    isLoading: isUserLoading,
    error: userError,
  } = useCurrentUser();

  const {
    data: workspaceDetail,
    isLoading: isWorkspaceDetailsLoading,
    isError: isWorkspaceDetailsError,
  } = useQuery({
    queryKey: ["workspaceDetail", workspaceId],
    queryFn: async () => {
      const response = await getWorkspaceDetails(workspaceId);
      return response;
    },
    enabled: !!workspaceId,
  });

  const {
    data: invites,
    isLoading: isInvitesLoading,
    error: invitesError,
  } = useQuery({
    queryKey: ["invites", currentUser?.email],
    enabled: currentUser?.email != null,
    queryFn: async () => {
      const token = await getToken({ template: "test" });
      const result = await getInvitesForUserEmail(currentUser.email, token);
      return result;
    },
    staleTime: 1000, // 1 second
  });

  const workspaceIds = invites
    ? Array.from(new Set(invites.map((invite: any) => invite.workspaceId)))
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
      const jwt = await getToken({ template: "test" });
      const result = await getAllowedWorkspacesForUser(currentUser?.id, jwt);
      return result;
    },
    enabled: currentUser?.id != null,
  });

  if (
    !isLoadedClerkUser ||
    isWorkspaceDetailsLoading ||
    isInvitesLoading ||
    isAllowedWorkspacesForUserLoading
  ) {
    return (
      <div className="h-screen bg-slate-1 z-10 relative text-white">
        Loading..
      </div>
    );
  }

  const allowed_domains_string = workspaceDetail.allowedDomains
    .map((domain: any) => {
      return "@" + domain.domain;
    })
    .join(", ");

  // find the matching workspace and invites
  const matchingAllowedWorkspace =
    allowedWorkspacesForUser?.find(
      (workspace: any) => workspace.id === workspaceId_as_number
    ) ?? null;

  const matchingInvite =
    invites?.find(
      (invite: any) => invite.workspaceId === workspaceId_as_number
    ) ?? null;

  const allowedAccess = !!matchingAllowedWorkspace || !!matchingInvite;

  console.log("allowedAccess", allowedAccess);
  console.log("matchingInvite", matchingInvite);
  console.log("matchingAllowedWorkspace", matchingAllowedWorkspace);

  if (user == null) {
    return (
      <>
        <div className="h-screen bg-slate-1 z-10 relative text-white">
          <header className="fixed top-8 left-8">
            <Link href="/" tabIndex={-1}>
              <Image
                src="/images/logo_darker.svg"
                width={100}
                height={40}
                alt="Dataland logo"
              ></Image>
            </Link>
          </header>
          <div className="flex flex-col justify-center items-center w-full h-screen bg-slate-1 pb-32">
            <div
              className={`h-[96px] w-[96px] flex items-center justify-center text-[32px] rounded-md`}
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
            <div className="bg-slate-1 text-slate-12 text-center text-[22px] mt-8 max-w-[420px]">
              You must be logged in to <br />
              access{" "}
              <span className="font-semibold">{workspaceDetail?.name}</span> on
              Dataland
            </div>
            <div className="flex flex-col items-center gap-4 mt-4">
              <Link href="/login">
                <button
                  className={`w-[240px] bg-blue-600 text-slate-12 text-[16px] font-medium rounded-md px-4 py-2 mt-2 flex flex-row gap-3 hover:bg-blue-700 justify-center h-10 items-center
                        `}
                >
                  Log in
                </button>
              </Link>
              <div className="flex flex-col gap-2 items-center mt-8">
                <div>
                  <span className="text-slate-11 text-[14px] inline">
                    No account yet?
                  </span>
                </div>
                <Link href="/signup">
                  <button
                    className={`w-[240px] bg-slate-3 text-slate-12 text-[16px] font-medium rounded-md px-4 py-2 flex flex-row gap-3 hover:bg-slate-4 justify-center h-10 items-center
                        `}
                  >
                    Create an account
                  </button>
                </Link>
                <div className="text-slate-11 text-[12px] text-center">
                  {workspaceDetail.allowedDomains &&
                    workspaceDetail.allowedDomains.length > 0 && (
                      <>
                        <p>Accounts with an email ending with</p>
                        <p>
                          <span className="text-white">
                            {allowed_domains_string}
                          </span>{" "}
                          can join this workspace
                        </p>
                      </>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // If user does exist, then check to see if they have this workspace as a membership.

  return (
    <div className="h-screen bg-slate-1 z-10 relative text-white">
      <AccountHeader email={currentUser.email} />
      <div className="w-full flex flex-col mt-32 items-center justify-center">
        {allowedAccess && (
          <>
            <div className="flex flex-col justify-center items-center w-full pb-32">
              <div
                className={`h-[96px] w-[96px] flex items-center justify-center text-[32px] rounded-md`}
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
              <div className="bg-slate-1 text-slate-12 text-center text-[22px] mt-8 max-w-[420px]">
                Welcome to{" "}
                <span className="font-semibold">{workspaceDetail?.name}</span>{" "}
                on Dataland
              </div>
              {matchingInvite && (
                <>
                  <div className="bg-slate-1 text-slate-11 text-center text-[16px] mt-4">
                    {matchingInvite.inviterEmail} invited you to join this
                    workspace
                  </div>
                  <div className="flex flex-col items-center gap-4 mt-4">
                    {/* If invited, add text */}
                    <button
                      className={`w-[240px] bg-blue-600 text-slate-12 text-[16px] font-medium rounded-md px-4 py-2 mt-2 flex flex-row gap-3 hover:bg-blue-700 justify-center h-10 items-center`}
                      onClick={() =>
                        handleAcceptInvite({
                          user: currentUser,
                          workspace: workspaceDetail,
                          invite: matchingInvite,
                        })
                      }
                    >
                      Join workspace
                    </button>
                  </div>
                </>
              )}
              {matchingAllowedWorkspace && (
                <>
                  <div className="bg-slate-1 text-slate-11 text-center text-[16px] mt-4">
                    Anyone {"@" + currentUser.email.split("@")[1]} can join this
                    workspace.
                  </div>
                  <div className="flex flex-col items-center gap-4 mt-4">
                    {/* If invited, add text */}
                    <button
                      className={`w-[240px] bg-blue-600 text-slate-12 text-[16px] font-medium rounded-md px-4 py-2 mt-2 flex flex-row gap-3 hover:bg-blue-700 justify-center h-10 items-center
                                        `}
                      onClick={() =>
                        handleJoinWorkspaceFromAllowedDomain({
                          user: currentUser,
                          workspace: workspaceDetail,
                        })
                      }
                    >
                      Join workspace
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
        {allowedAccess == false && (
          <>
            <div className="flex flex-col justify-center items-center w-full pb-32">
              <div
                className={`h-[96px] w-[96px] flex items-center justify-center text-[32px] rounded-md`}
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
              <div className="bg-slate-1 text-slate-12 text-center text-[22px] mt-8 max-w-[420px]">
                You don&apos;t have access to the
                <br />{" "}
                <span className="font-semibold">
                  {workspaceDetail?.name}
                </span>{" "}
                workspace
              </div>

              <div className="bg-slate-1 text-slate-11 text-center text-[16px] mt-4">
                Ask a workspace member to invite you first.
              </div>
              <div className="flex flex-col items-center gap-4 mt-12">
                <Link href="/dashboard">
                  <button
                    className={`bg-slate-3 text-slate-12 text-[14px] font-medium rounded-md px-4 py-2 mt-2 flex flex-row gap-3 hover:bg-slate-4 justify-center h-10 items-center`}
                  >
                    Go back to Dataland
                  </button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
