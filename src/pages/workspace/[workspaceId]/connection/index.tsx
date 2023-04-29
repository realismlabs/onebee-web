import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCurrentWorkspace } from "@/hooks/useCurrentWorkspace";
import { getWorkspaceConnections, getTablesFromConnection } from "@/utils/api";
import WorkspaceLayout from "@/components/WorkspaceLayout";
import LogoSnowflake from "@/components/LogoSnowflake";
import LogoBigQuery from "@/components/LogoBigQuery";
import LogoPostgres from "@/components/LogoPostgres";
import Link from "next/link";
import { useState } from "react";
import { formatFriendlyDate, abbreviateNumber } from "@/utils/util";

function findSelectedConnection(
  connectionsData: any,
  selectedConnectionId: any
) {
  if (!selectedConnectionId) return null;
  return connectionsData.find(
    (connection: any) => connection.id === selectedConnectionId
  );
}

export default function Connections() {
  const router = useRouter();
  const { tableId } = router.query;

  const [selectedConnectionId, setSelectedConnectionId] = useState(null);

  console.log("id", tableId);

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
    data: tablesFromConnectionData,
    isLoading: istablesFromConnectionLoading,
    error: tablesFromConnectionError,
  } = useQuery({
    queryKey: [
      "getTablesFromConnection",
      currentWorkspace?.id,
      selectedConnectionId,
    ],
    queryFn: async () => {
      const response = await getTablesFromConnection(
        currentWorkspace?.id,
        selectedConnectionId
      );
      return response;
    },
    enabled: currentWorkspace?.id !== null && selectedConnectionId !== null,
  });

  const selectedConnection = findSelectedConnection(
    connectionsData,
    selectedConnectionId
  );

  if (isConnectionsLoading) {
    return <div>Loading...</div>;
  }

  if (connectionsError) {
    return <div>There was an error loading your table</div>;
  }

  return (
    <WorkspaceLayout>
      <div className="bg-slate-1 h-screen text-white flex flex-row divide-slate-4 divide-y">
        <div className="min-w-[360px] border-r border-slate-4 overflow-y-scroll grow">
          <div className="flex flex-row gap-2 items-center border-b border-slate-4 py-[12px] px-[20px] sticky top-0 bg-slate-1">
            <p className="text-white text-[13px]">Connections</p>
          </div>
          <div className="grow flex flex-col items-start text-[13px] overflow-y-scroll">
            {connectionsData.map((connection: any) => (
              <div
                key={connection.id}
                className={`flex flex-row w-full gap-4 items-start border-b border-slate-4 px-[20px] py-[12px] cursor-pointer ${
                  selectedConnectionId === connection.id
                    ? "bg-slate-3 hover:bg-slate-3"
                    : "bg-slate-1 hover:bg-slate-2"
                }`}
                onClick={() => setSelectedConnectionId(connection.id)}
              >
                <div className="h-[24px] w-[24px]">
                  {connection.connectionType === "snowflake" && (
                    <LogoSnowflake />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-white text-[13px]">{connection.name}</p>
                  <p className="text-slate-11 text-[12px]">
                    {connection.accountIdentifier}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full overflow-y-scroll grow ">
          {selectedConnectionId !== null && (
            <>
              <div className="flex flex-row gap-2 items-center border-b border-slate-4 py-[12px] px-[40px] sticky top-0 bg-slate-1">
                <p className="text-white text-[13px]">
                  {
                    connectionsData.find(
                      (connection: any) =>
                        connection.id === selectedConnectionId
                    )?.name
                  }
                </p>
              </div>
              <div className="flex items-center justify-center">
                <div className="max-w-[720px] w-full flex items-center">
                  <div className="flex flex-col mt-[24px] gap-4 items-center w-full">
                    <div className="flex flex-row pb-2 border-b border-slate-4 w-full items-center">
                      <p className="text-[14px]">Connection details</p>
                      <button className="bg-slate-6 text-[13px] text-white px-[12px] py-[8px] rounded-md ml-auto">
                        Edit
                      </button>
                      <button className="bg-red-5 text-[13px] text-white px-[12px] py-[8px] rounded-md ml-[8px]">
                        Delete
                      </button>
                    </div>
                    {selectedConnectionId &&
                      selectedConnection?.connectionType === "snowflake" && (
                        <div className="flex flex-col gap-4 w-full">
                          <div className="flex flex-row gap-3 text-[13px]">
                            <p className="w-[180px] text-slate-11">
                              Display name
                            </p>
                            <p className="">{selectedConnection?.name}</p>
                          </div>
                          <div className="flex flex-row gap-3 text-[13px]">
                            <p className="w-[180px] text-slate-11">
                              Account identifier
                            </p>
                            <p>{selectedConnection?.accountIdentifier}</p>
                          </div>
                          <div className="flex flex-row gap-3 text-[13px]">
                            <p className="w-[180px] text-slate-11">Warehouse</p>
                            <p>{selectedConnection?.warehouse}</p>
                          </div>
                          <div className="flex flex-row gap-3 text-[13px]">
                            <p className="w-[180px] text-slate-11">
                              Created at
                            </p>
                            <p>
                              {formatFriendlyDate(
                                selectedConnection?.createdAt
                              )}
                            </p>
                          </div>
                          <div className="flex flex-row gap-3 text-[13px]">
                            <p className="w-[180px] text-slate-11">Role</p>
                            <p>{selectedConnection?.role}</p>
                          </div>
                          <div className="flex flex-row gap-3 text-[13px]">
                            <p className="w-[180px] text-slate-11">Username</p>
                            <p>{selectedConnection?.basicAuthUsername}</p>
                          </div>
                          <div className="flex flex-row gap-3 text-[13px]">
                            <p className="w-[180px] text-slate-11">
                              Connection type
                            </p>
                            <div className="flex flex-row gap-2 items-center">
                              <div className="h-[20px] w-[20px]">
                                <LogoSnowflake />
                              </div>
                              <p>Snowflake</p>
                            </div>
                          </div>
                        </div>
                      )}
                    <div className="w-full">
                      {selectedConnectionId && (
                        <>
                          <div className="flex flex-row gap-3 mt-8 text-[14px] items-center">
                            Connected tables{" "}
                            <div className="text-[12px] px-[4px] py-[2px] bg-slate-3">
                              {tablesFromConnectionData.length}
                            </div>
                          </div>
                          <div className="flex flex-col mt-4 border-slate-4 rounded-lg border">
                            {tablesFromConnectionData.map((table: any) => (
                              <Link
                                key={table.id}
                                href={`/workspace/${currentWorkspace.id}/table/${table.id}`}
                              >
                                <div className="flex flex-row gap-4 items-center border-b border-slate-4 text-[13px] px-[20px] py-[12px] cursor-pointer bg-slate-1 hover:bg-slate-2 text-white">
                                  <div className="w-[180px]">
                                    {table.displayName}
                                  </div>
                                  <pre className="px-2 py-1 bg-slate-3 rounded-sm text-slate-11 text-[11px]">
                                    {table.connectionPath}
                                  </pre>
                                  <div className="ml-auto">
                                    {abbreviateNumber(table.rowCount) + " rows"}
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </WorkspaceLayout>
  );
}
