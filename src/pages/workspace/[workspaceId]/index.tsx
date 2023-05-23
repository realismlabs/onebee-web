import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCurrentWorkspace } from "@/hooks/useCurrentWorkspace";
import { getWorkspaceConnections, getTables } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import WorkspaceLayout from "@/components/WorkspaceLayout";
import {
  Chat,
  Files,
  CaretDown,
  CaretUp,
  Gavel,
  GridFour,
  List,
  UserPlus,
  Warning,
} from "@phosphor-icons/react";
import { IconLoaderFromSvgString } from "@/components/IconLoaderFromSVGString";
import { abbreviateNumber, friendlyRelativeDateToNow } from "@/utils/util";
import { useLocalStorageState, capitalizeString } from "@/utils/util";
import { useAuth } from "@clerk/nextjs";

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
            className="h-[28px] min-w-[28px] flex items-center justify-center rounded-md border"
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
  const { getToken } = useAuth();

  const [tableLayout, setTableLayout] = useLocalStorageState(
    "tableLayout",
    "grid"
  );
  const [tableListSortField, setTableListSortField] = useLocalStorageState(
    "tableListSortField",
    "updatedAt"
  ); // Default sort field
  const [tableListSortDirection, setTableListSortDirection] =
    useLocalStorageState("tableListSortDirection", "asc"); // Default sort direction: 'asc' or 'desc'

  const handleTableListHeaderClick = (newSortField: string) => {
    // If the user clicks the same field again, reverse the direction
    if (newSortField === tableListSortField) {
      setTableListSortDirection((prevDirection: string) =>
        prevDirection === "asc" ? "desc" : "asc"
      );
    } else {
      // If the user clicks a different field, change the field and set direction to 'asc'
      setTableListSortField(newSortField);
      setTableListSortDirection("asc");
    }
  };

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
      const jwt = await getToken({ template: "test" });
      const response = await getTables(currentWorkspace?.id, jwt);
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
  const email_content_before_at = capitalizeString(email.split("@")[0]);

  const sortedTablesData = [...tablesData].sort((a, b) => {
    if (a[tableListSortField] < b[tableListSortField])
      return tableListSortDirection === "asc" ? -1 : 1;
    if (a[tableListSortField] > b[tableListSortField])
      return tableListSortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <WorkspaceLayout>
      <div className="h-screen bg-slate-1 overflow-y-auto">
        <div className="flex flex-col justify-center items-center w-full pt-16">
          <div className="bg-slate-1 text-slate-12 text-left flex flex-col items-start text-[22px] pb-4 w-[1000px] gap-4">
            <div className="items-start text-left text-[16px] pb-[16px] border-b border-slate-4 w-full">
              Welcome, {currentUser.name ?? email_content_before_at}!
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
                      Import table
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
                  <div className="flex flex-row p-1 bg-slate-2 gap-0.5 rounded-md ml-auto">
                    <button
                      className={`bg-slate-2 hover:bg-slate-5 hover:border-slate-6 rounded-md p-1 ${
                        tableLayout === "grid" && "bg-slate-5"
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
                      className={`bg-slate-2 hover:bg-slate-5 hover:border-slate-6 rounded-md p-1 ${
                        tableLayout === "list" && "bg-slate-5"
                      }`}
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
                  <div className="w-full flex flex-col">
                    <div className="flex flex-row gap-4 items-center text-[13px] text-slate-12 pb-3">
                      <div
                        className="text-[12px] text-slate-11 cursor-pointer w-[376px] flex flex-row gap-1 items-center"
                        onClick={() =>
                          handleTableListHeaderClick("displayName")
                        }
                      >
                        <p>Name</p>
                        {tableListSortField === "displayName" &&
                          tableListSortDirection === "desc" && (
                            <CaretDown
                              className="w-3 h-3 text-slate-10"
                              weight="fill"
                            />
                          )}
                        {tableListSortField === "displayName" &&
                          tableListSortDirection === "asc" && (
                            <CaretUp
                              className="w-3 h-3 text-slate-10"
                              weight="fill"
                            />
                          )}
                      </div>
                      <div
                        className="text-[12px] text-slate-11 cursor-pointer flex flex-row gap-1 items-center mr-auto"
                        onClick={() =>
                          handleTableListHeaderClick("connectionPath")
                        }
                      >
                        <p>Connection path</p>
                        {tableListSortField === "connectionPath" &&
                          tableListSortDirection === "desc" && (
                            <CaretDown
                              className="w-3 h-3 text-slate-10"
                              weight="fill"
                            />
                          )}
                        {tableListSortField === "connectionPath" &&
                          tableListSortDirection === "asc" && (
                            <CaretUp
                              className="w-3 h-3 text-slate-10"
                              weight="fill"
                            />
                          )}
                      </div>
                      <div
                        className="w-[164px] text-[12px] text-slate-11 cursor-pointer flex flex-row gap-1 items-center"
                        onClick={() => handleTableListHeaderClick("updatedAt")}
                      >
                        Updated at
                        {tableListSortField === "updatedAt" &&
                          tableListSortDirection === "desc" && (
                            <CaretDown
                              className="w-3 h-3 text-slate-10"
                              weight="fill"
                            />
                          )}
                        {tableListSortField === "updatedAt" &&
                          tableListSortDirection === "asc" && (
                            <CaretUp
                              className="w-3 h-3 text-slate-10"
                              weight="fill"
                            />
                          )}
                      </div>
                      <div
                        className="w-[80px] text-right cursor-pointer  text-[12px] text-slate-11  flex flex-row gap-1 items-center"
                        onClick={() => handleTableListHeaderClick("rowCount")}
                      >
                        Row count
                        {tableListSortField === "rowCount" &&
                          tableListSortDirection === "desc" && (
                            <CaretDown
                              className="w-3 h-3 text-slate-10"
                              weight="fill"
                            />
                          )}
                        {tableListSortField === "rowCount" &&
                          tableListSortDirection === "asc" && (
                            <CaretUp
                              className="w-3 h-3 text-slate-10"
                              weight="fill"
                            />
                          )}
                      </div>
                    </div>
                    <div className="flex flex-col border-slate-4 rounded-lg border overflow-clip">
                      {sortedTablesData.map((table: any, index: number) => (
                        <Link
                          key={table.id}
                          href={`/workspace/${currentWorkspace.id}/table/${table.id}`}
                        >
                          <div
                            className={`flex flex-row gap-4 items-center ${
                              index < tablesData.length - 1
                                ? "border-b border-slate-4"
                                : ""
                            } text-[13px] px-[20px] py-[12px] cursor-pointer bg-slate-1 hover:bg-slate-2 text-slate-12`}
                          >
                            <div className="text-[13px] text-slate-12">
                              <IconLoaderFromSvgString
                                iconSvgString={table.iconSvgString}
                                tableName={table.displayName}
                              />
                            </div>
                            <div className="w-[320px] truncate">
                              {table.displayName}
                            </div>

                            <pre className="px-2 py-1 bg-slate-3 rounded-sm text-slate-11 text-[11px] truncate mr-auto">
                              {table.connectionPath}
                            </pre>
                            <div className="min-w-[100px] max-w-[100px] text-left text-slate-11">
                              {friendlyRelativeDateToNow(table.updatedAt)}
                            </div>
                            <div className="w-[120px] text-right lining-nums text-slate-11">
                              {abbreviateNumber(table.rowCount)}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
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
