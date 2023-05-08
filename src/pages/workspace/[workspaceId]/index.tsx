import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import router from "next/router";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCurrentWorkspace } from "@/hooks/useCurrentWorkspace";
import {
  getWorkspaceConnections,
  getTablesFromConnection,
  deleteConnection,
  updateConnectionDisplayName,
  getTables,
} from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import WorkspaceLayout from "@/components/WorkspaceLayout";
import {
  Chat,
  Check,
  Files,
  Gavel,
  MonitorPlay,
  Taxi,
  UserPlus,
  Warning,
} from "@phosphor-icons/react";
import { IconLoaderFromSvgString } from "@/components/IconLoaderFromSVGString";
import { abbreviateNumber } from "@/utils/util";

export default function WorkspaceHome() {
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
    data: connectionsData,
    isLoading: isConnectionsLoading,
    error: connectionsError,
  } = useQuery({
    queryKey: ["getConnections", currentWorkspace?.id],
    queryFn: async () => {
      const response = await getWorkspaceConnections(currentWorkspace?.id);
      return response;
    },
    enabled: currentWorkspace?.id !== null,
  });

  const {
    data: tablesData,
    isLoading: isTablesLoading,
    error: tablesError,
  } = useQuery({
    queryKey: ["getTables", currentWorkspace?.id],
    queryFn: async () => {
      const response = await getTables(currentWorkspace?.id);
      return response;
    },
    enabled: currentWorkspace?.id !== null,
  });

  if (
    isUserLoading ||
    isWorkspaceLoading ||
    isConnectionsLoading ||
    isTablesLoading
  ) {
    return <div className="h-screen bg-slate-1"></div>;
  }

  if (userError || workspaceError || connectionsError || tablesError) {
    return <div>Error: {JSON.stringify(userError)}</div>;
  }

  const email = currentUser.email;

  let needsOnboarding = false;
  let nextOnboardingStep = "";

  // if connectionsData.length === 0 and table sdata is 0 ,
  if (connectionsData?.length === 0) {
    needsOnboarding = true;
    nextOnboardingStep = "next-add-connection";
  }

  // if only tables Data is 0:

  // If connections data = 0  + tables data > 0, then no onboarding needed

  return (
    <WorkspaceLayout>
      <div className="h-screen bg-slate-1">
        <div className="flex flex-col justify-center items-center w-full pt-16">
          <div className="bg-slate-1 text-slate-12 text-left flex flex-col items-start text-[22px] pb-4 w-[1000px] gap-4">
            <div className="items-start text-left text-[16px] pb-[16px] border-b border-slate-4 w-full">
              Hi {email ?? "there"}!
            </div>
            {/* Actions */}
            {/* If there are no connections, get them to add a connection */}
            {connectionsData?.length === 0 && (
              <div
                className="bg-blue-2 rounded-lg border border-blue-9 w-full pb-[200px] overflow-hidden items-center justify-center"
                style={{
                  backgroundImage:
                    "url('/images/add-data-connection-splash-half-opacity.svg')",
                  backgroundPosition: "center 84px",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "contain",
                }}
              >
                <div className="absolute text-blue-11 text-[14px] text-center py-[4px] px-[12px] bg-blue-2 border-opacity-10 border-blue-9 border-b border-r rounded-tl-lg rounded-br-lg">
                  Finish setup
                </div>
                <div className="z-10 pt-[48px] flex flex-col gap-2 items-center justify-center">
                  <div className="text-slate-12 text-[16px] text-center">
                    Add a data connection
                  </div>
                  <div className="text-slate-11 text-[14px]">
                    Connect your Snowflake, BigQuery, or Postgres
                  </div>
                  <Link
                    href={`/workspace/${currentWorkspace?.id}/onboarding/add-data-source`}
                  >
                    <button
                      type="button"
                      className="mt-[8px] bg-blue-600 hover:bg-blue-700 text-slate-12 text-[14px] font-medium py-[8px] px-[16px] rounded-md"
                    >
                      Add connection
                    </button>
                  </Link>
                </div>
              </div>
            )}
            {connectionsData?.length > 0 && tablesData?.length === 0 && (
              <div
                className="bg-blue-2 rounded-lg border border-blue-9 w-full pb-[200px] overflow-hidden items-center justify-center"
                style={{
                  backgroundImage: "url('/images/gradient-table-circles.png')",
                  backgroundPosition: "center -30px",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }}
              >
                <div className="absolute text-blue-11 text-[14px] text-center py-[4px] px-[12px] bg-blue-2 border-opacity-10 border-blue-9 border-b border-r rounded-tl-lg rounded-br-lg">
                  Finish setup
                </div>
                <div className="z-10 pt-[48px] flex flex-col gap-2 items-center justify-center">
                  <div className="text-slate-12 text-[16px] text-center">
                    Create a table
                  </div>
                  <div className="text-slate-11 text-[14px]">
                    Sync a source table from data connection
                  </div>
                  <Link href={`/workspace/${currentWorkspace?.id}/table/new`}>
                    <button
                      type="button"
                      className="mt-[8px] bg-blue-600 hover:bg-blue-700 text-slate-12 text-[14px] font-medium py-[8px] px-[16px] rounded-md"
                    >
                      Create table
                    </button>
                  </Link>
                </div>
              </div>
            )}
            {/* If there are no tables, get them to add a table */}

            {tablesData?.length > 0 && (
              <>
                <div className="w-full text-slate-12 text-[14px] mt-[16px] flex flex-row gap-4 items-end">
                  <div className="w-[84px]">Tables</div>
                  <div className="text-slate-10 text-[13px]"></div>
                </div>
                {/* set up grid */}
                <div className="w-full grid grid-cols-3 gap-4">
                  {/* If there are no tables, get them to add a table */}
                  {tablesData.map((table: any) => (
                    <Link
                      href={`/workspace/${currentWorkspace?.id}/table/${table.id}`}
                      key={table.id}
                    >
                      <div className="bg-slate-2 border hover:bg-slate-3 hover:border-slate-6 border-slate-3 rounded-md w-full p-[16px] flex flex-row gap-4">
                        <div className="h-[20px] min-w-[20px] flex items-center justify-center">
                          <IconLoaderFromSvgString
                            iconSvgString={table.iconSvgString}
                          />
                        </div>
                        <div className="flex flex-col truncate">
                          <div className="text-slate-12 text-[14px] font-medium truncate">
                            {table.displayName}
                          </div>
                          <p className="text-slate-11 text-[12px]">
                            {table.description}
                          </p>
                          <div className="text-[11px] text-slate-11 pt-[6px] font-mono">
                            {abbreviateNumber(table.rowCount)} rows
                          </div>
                          <div className="text-[11px] text-slate-11 pt-[6px] font-mono">
                            {table.fullName}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
            <div className="w-full text-slate-12 text-[14px] mt-[32px] flex flex-row gap-4 items-end">
              <div className="">Sandbox</div>
              <div className="text-slate-10 text-[13px]">
                Play with example datasets in our sandbox
              </div>
            </div>
            <div className="w-full flex flex-row gap-4">
              <div className="bg-slate-2 border hover:bg-slate-3 hover:border-slate-6 border-slate-3 rounded-md w-full pl-[16px] pr-[32px] py-[16px] text-[16px] flex flex-row gap-4">
                <div className="h-[36px] min-w-[36px] flex items-center justify-center bg-slate-3 border border-slate-6 rounded-md">
                  <Chat className="text-orange-9" weight="fill" size={20} />
                </div>
                <div className="flex flex-col">
                  <div className="text-[14px]">Hacker News comments</div>
                  <div className="text-[11px] text-slate-11 pt-[6px] font-mono">
                    1.2B rows
                  </div>
                </div>
              </div>
              <div className="bg-slate-2 border hover:bg-slate-3 hover:border-slate-6 border-slate-3 rounded-md w-full pl-[16px] pr-[32px] py-[16px] text-[16px] flex flex-row gap-4">
                <div className="h-[36px] min-w-[36px] flex items-center justify-center bg-slate-3 border border-slate-6 rounded-md">
                  <Warning className="text-amber-11" weight="fill" size={20} />
                </div>
                <div className="flex flex-col">
                  <div className="text-[14px]">CFPB consumer complaints</div>
                  <div className="text-[11px] text-slate-11 pt-[6px] font-mono">
                    1.6B rows
                  </div>
                </div>
              </div>
              <div className="bg-slate-2 border hover:bg-slate-3 hover:border-slate-6 border-slate-3 rounded-md w-full pl-[16px] pr-[32px] py-[16px] text-[16px] flex flex-row gap-4">
                <div className="h-[36px] min-w-[36px] flex items-center justify-center bg-slate-3 border border-slate-6 rounded-md">
                  <Gavel className="text-crimson-11" weight="fill" size={20} />
                </div>
                <div className="flex flex-col">
                  <div className="text-[14px]">
                    USPTO Patent Assignment Data
                  </div>
                  <div className="text-[11px] text-slate-11 pt-[6px] font-mono">
                    1.2B rows
                  </div>
                </div>
              </div>{" "}
            </div>

            {/* General */}
            {/* Generally show links to things like Docs, Sandbox, Demo video, Invite other teammates environment */}
            {/* Generally, show tables list Subwa*/}
            <div className="w-full text-slate-12 text-[14px] mt-[32px]">
              Resources
            </div>
            <div className="w-full grid grid-cols-3 gap-4">
              <div className="bg-slate-2 border hover:bg-slate-3 hover:border-slate-6 border-slate-3 rounded-md w-full pl-[16px] pr-[32px] py-[16px] text-[16px] flex flex-row gap-4">
                <div className="h-[36px] min-w-[36px] flex items-center justify-center bg-slate-3 border border-slate-6 rounded-md">
                  <Files className="text-slate-12" weight="duotone" size={20} />
                </div>
                <div className="flex flex-col">
                  <div className="text-[14px]">Docs</div>
                  <div className="text-[13px] text-slate-11 pt-[6px]">
                    Read user guides and docs on how to get the most out of
                    Dataland
                  </div>
                </div>
              </div>
              <div className="bg-slate-2 border hover:bg-slate-3 hover:border-slate-6 border-slate-3 rounded-md w-full pl-[16px] pr-[32px] py-[16px] text-[16px] flex flex-row gap-4">
                <div className="h-[36px] min-w-[36px] flex items-center justify-center bg-slate-3 border border-slate-6 rounded-md">
                  <UserPlus
                    className="text-slate-12"
                    weight="duotone"
                    size={20}
                  />
                </div>
                <div className="flex flex-col">
                  <div className="text-[14px]">Invite teammates</div>
                  <div className="text-[13px] text-slate-11 pt-[6px]">
                    You get unlimited seats on Dataland. Invite your teammates
                    to browse data in Dataland.
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
