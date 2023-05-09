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
  GridFour,
  List,
  MonitorPlay,
  Table,
  Taxi,
  UserPlus,
  Warning,
} from "@phosphor-icons/react";
import { IconLoaderFromSvgString } from "@/components/IconLoaderFromSVGString";
import { abbreviateNumber, friendlyRelativeDateToNow } from "@/utils/util";

const TableCard = ({
  table,
  currentWorkspace,
}: {
  table: any;
  currentWorkspace: any;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const colorMap: any = [
    {
      name: "red",
      backgroundColor1: "#1F1315",
      backgroundColor2: "#291415",
      foregroundColor: "#E5484D",
    },
    {
      name: "pink",
      backgroundColor1: "#1F121B",
      backgroundColor2: "#271421",
      foregroundColor: "#E93D82",
    },
    {
      name: "orange",
      backgroundColor1: "#1F1206",
      backgroundColor2: "#2B1400",
      foregroundColor: "#F76808",
    },
    // '#0091FF', // blue
    {
      name: "blue",
      backgroundColor1: "#0F1720",
      backgroundColor2: "#0F1B2D",
      foregroundColor: "#0091FF",
    },
    // '#3E63DD', // indigo
    {
      name: "indigo",
      backgroundColor1: "#131620",
      backgroundColor2: "#15192D",
      foregroundColor: "#3E63DD",
    },
    // '#7C66DC', // violet
    {
      name: "violet",
      backgroundColor1: "#17151F",
      backgroundColor2: "#1C172B",
      foregroundColor: "#7C66DC",
    },
    // '#9D5BD2', // purple
    {
      name: "purple",
      backgroundColor1: "#1B141D",
      backgroundColor2: "#221527",
      foregroundColor: "#9D5BD2",
    },
    // '#AB4ABA', // plum
    {
      name: "plum",
      backgroundColor1: "#1D131D",
      backgroundColor2: "#251425",
      foregroundColor: "#AB4ABA",
    },
    // '#FFB224', // amber
    {
      name: "amber",
      backgroundColor1: "#1F1300",
      backgroundColor2: "#271700",
      foregroundColor: "#FFB224",
    },
    // '#F5D90A', // yellow
    {
      name: "yellow",
      backgroundColor1: "#1C1500",
      backgroundColor2: "#221A00",
      foregroundColor: "#F5D90A",
    },
    // '#99D52A', // lime
    {
      name: "lime",
      backgroundColor1: "#141807",
      backgroundColor2: "#181D08",
      foregroundColor: "#99D52A",
    },
    // '#46A758', // green
    {
      name: "green",
      backgroundColor1: "#0D1912",
      backgroundColor2: "#0C1F17",
      foregroundColor: "#46A758",
    },
    // '#9BA1A6', // slate
  ];

  const backgroundColor1 = colorMap.find(
    (color: any) => color.foregroundColor === table.iconColor
  )?.backgroundColor1;
  const backgroundColor2 = colorMap.find(
    (color: any) => color.foregroundColor === table.iconColor
  )?.backgroundColor2;

  return (
    <Link href={`/workspace/${currentWorkspace?.id}/table/${table.id}`}>
      <div
        className={`relative border hover:border-slate-6 border-slate-3 rounded-md w-full p-[16px] flex flex-col gap-3 overflow-clip
    bg-[${table.iconColor}]
    `}
        style={{
          backgroundColor: isHovered ? backgroundColor2 : backgroundColor1,
          borderColor: isHovered
            ? table.iconColor + "40"
            : table.iconColor + "30",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-row gap-3 items-center w-full truncate">
          <div
            className="h-[32px] min-w-[32px] flex items-center justify-center rounded-md border"
            style={{
              backgroundColor: table.iconColor + "30",
              borderColor: table.iconColor + "30",
            }}
          >
            <IconLoaderFromSvgString iconSvgString={table.iconSvgString} />
          </div>
          <div className="flex flex-col truncate">
            <div className="text-slate-12 text-[14px] font-medium truncate block">
              {table.displayName}
            </div>
          </div>
        </div>
        <div className="flex flex-col truncate">
          <div className="flex flex-row gap-2">
            <div className="font-mono block truncate text-[12px] text-slate-11">
              {table.fullName.replaceAll(".", "/")}
            </div>
          </div>
          <div className="flex flex-row gap-2 items-center mt-2">
            <div className="text-[12px] text-slate-11 font-mono">
              {abbreviateNumber(table.rowCount)} rows •
            </div>
            <div className="text-[12px] text-slate-11 font-mono">
              Updated {friendlyRelativeDateToNow(table.updatedAt)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
export default function WorkspaceHome() {
  const [tableLayout, setTableLayout] = useState("grid");

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
      <div className="h-screen bg-slate-1 overflow-y-auto">
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
                <div className="w-full text-[14px] flex flex-row gap-4 items-center">
                  <div className="w-[84px]">Tables</div>
                  <div className="flex flex-row p-1 bg-slate-2 rounded-md ml-auto">
                    <button
                      className={`bg-slate-2 hover:bg-slate-3 hover:border-slate-6 rounded-md p-1 ${
                        tableLayout === "grid" && "bg-slate-4"
                      }`}
                      onClick={() => setTableLayout("grid")}
                    >
                      <GridFour
                        className={`w-5 h-5 ${
                          tableLayout === "grid"
                            ? "text-slate-12"
                            : "text-slate-10"
                        }`}
                        weight="fill"
                      />
                    </button>
                    <button
                      className={`bg-slate-2 hover:bg-slate-3 hover:border-slate-6 rounded-md p-1`}
                      onClick={() => setTableLayout("list")}
                    >
                      <List
                        className={`w-5 h-5 ${
                          tableLayout === "list"
                            ? "text-slate-12"
                            : "text-slate-10"
                        }`}
                        weight="fill"
                      />
                    </button>
                  </div>
                </div>
                {/* set up grid */}
                {tableLayout === "list" && (
                  <div className="w-full flex flex-col gap-4">
                    {tablesData.map((table: any) => (
                      <TableCard
                        table={table}
                        currentWorkspace={currentWorkspace}
                        key={table.id}
                      />
                    ))}
                  </div>
                )}
                {tableLayout === "grid" && (
                  <div className="w-full grid grid-cols-3 gap-4">
                    {tablesData.map((table: any) => (
                      <TableCard
                        table={table}
                        currentWorkspace={currentWorkspace}
                        key={table.id}
                      />
                    ))}
                  </div>
                )}
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
