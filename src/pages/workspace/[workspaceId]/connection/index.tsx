import { useRouter } from "next/router";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCurrentWorkspace } from "@/hooks/useCurrentWorkspace";
import {
  getWorkspaceConnections,
  getTablesFromConnection,
  deleteConnection,
  updateConnectionDisplayName,
} from "@/utils/api";
import WorkspaceLayout from "@/components/WorkspaceLayout";
import LogoSnowflake from "@/components/LogoSnowflake";
import LogoBigQuery from "@/components/LogoBigQuery";
import LogoPostgres from "@/components/LogoPostgres";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { formatFriendlyDate, abbreviateNumber } from "@/utils/util";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { PencilSimpleLine, X, TreeStructure } from "@phosphor-icons/react";
import { IconLoaderFromSvgString } from "@/components/IconLoaderFromSVGString";
import { Dialog } from "@headlessui/react";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";

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
  const { getToken } = useAuth();
  const router = useRouter();
  const { tableId } = router.query;

  const displayNameInputRef = useRef<HTMLInputElement>(null);

  const [selectedConnectionId, setSelectedConnectionId] = useState(null);
  const [displayNameInputValue, setDisplayNameInputValue] = useState("");
  const [isEditingDisplayName, setIsEditingDisplayName] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");

  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  useEffect(() => {
    if (isEditingDisplayName && displayNameInputRef.current) {
      displayNameInputRef.current.focus();
    }
  }, [isEditingDisplayName, displayNameInputRef]);

  console.log("id", tableId);

  const queryClient = useQueryClient();

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
      const jwt = await getToken({ template: "test" });
      const response = await getTablesFromConnection(
        currentWorkspace?.id,
        selectedConnectionId,
        jwt
      );
      return response;
    },
    enabled: currentWorkspace?.id !== null && selectedConnectionId !== null,
  });

  const deleteConnectionMutation = useMutation(deleteConnection, {
    onSuccess: () => {
      queryClient.invalidateQueries(["getConnections", currentWorkspace?.id]);
      setSelectedConnectionId(null);
    },
  });

  const handleDeleteConnection = async () => {
    try {
      await deleteConnectionMutation.mutateAsync({
        workspaceId: currentWorkspace.id,
        connectionId: selectedConnectionId,
      });
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      setDeleteErrorMessage(JSON.stringify(error));
    }
  };

  const updateConnectionMutation = useMutation(updateConnectionDisplayName, {
    onSuccess: () => {
      queryClient.invalidateQueries(["getConnections", currentWorkspace?.id]);
    },
  });

  const handleUpdateDisplayName = async () => {
    await updateConnectionMutation.mutateAsync({
      workspaceId: currentWorkspace.id,
      connectionId: selectedConnectionId,
      data: {
        name: displayNameInputValue,
      },
    });
    setIsEditingDisplayName(false);
  };

  const selectedConnection = findSelectedConnection(
    connectionsData,
    selectedConnectionId
  );

  if (isConnectionsLoading) {
    return (
      <div className="h-screen bg-slate-1 text-slate-12 text-[11px] flex items-center justify-center">
        Loading..
      </div>
    );
  }

  if (connectionsError) {
    return <div>There was an error loading your table</div>;
  }

  return (
    <WorkspaceLayout>
      <div className="bg-slate-1 h-screen text-slate-12 flex flex-row divide-slate-4 divide-y">
        <div className="min-w-[360px] max-w-[360px] border-r border-slate-4 overflow-y-scroll grow">
          <div className="flex flex-row gap-2 items-center border-b border-slate-4 py-[12px] pl-[12px] pr-[12px] sticky top-0 bg-slate-1 h-[48px]">
            <div className="h-[24px] w-[24px] flex items-center justify-center">
              <TreeStructure
                size={20}
                weight="fill"
                className="text-slate-10"
              />
            </div>
            <p className="text-slate-12 text-[13px]">Data connections</p>

            <button
              className="bg-slate-3 hover:bg-slate-4 border border-slate-6 text-[13px] text-slate-12 px-[12px] py-[4px] rounded-[4px] ml-auto"
              onClick={() => {
                router.push(
                  `/workspace/${currentWorkspace?.id}/connection/new`
                );
              }}
            >
              + New
            </button>
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
                <div className="min-h-[36px] min-w-[36px] bg-slate-2 flex items-center justify-center border border-slate-4 rounded-md">
                  {connection.connectionType === "snowflake" && (
                    <div className="w-[20px] h-[20px]">
                      <LogoSnowflake />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 flex-grow-1 min-w-0">
                  <p className="text-slate-12 text-[13px] truncate max-w-full">
                    {connection.name}
                  </p>
                  <p className="text-slate-11 text-[12px]">
                    {connection.accountIdentifier}
                  </p>
                </div>
              </div>
            ))}
            {connectionsData.length === 0 && (
              <div className="w-full flex flex-col gap-2 mt-4 items-connection justify-center items-center py-6">
                <Image
                  src="/images/connection-splash-zero-state.svg"
                  width={48}
                  height={48}
                  alt="Splash icon for tables zero state"
                  className=""
                />
                <p className="text-slate-11 px-[16px] text-center text-[13px] mt-2 truncate block">
                  No connections created yet
                </p>
                <p className="text-slate-10 px-[16px] text-center text-[12px] truncate block">
                  Create a connection by clicking the <br />+ New button in the
                  top-right
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="w-full overflow-y-scroll grow ">
          {selectedConnectionId !== null && (
            <>
              <div className="flex items-center justify-center">
                <div className="max-w-[720px] w-full flex items-center">
                  <div className="flex flex-col mt-[48px] gap-4 items-center w-full">
                    <div className="flex flex-row pb-2 border-b border-slate-4 w-full items-center">
                      <p className="text-[14px]">Connection details</p>
                      <button
                        className="bg-red-5 hover:bg-red-6 border-red-7 border text-[13px] text-slate-12 px-[12px] py-[4px] rounded-[4px] ml-auto"
                        onClick={openDeleteDialog}
                      >
                        Delete
                      </button>
                    </div>
                    <Dialog
                      as="div"
                      open={isDeleteDialogOpen}
                      onClose={() => setIsDeleteDialogOpen(false)}
                      className="absolute inset-0 flex min-w-full h-screen"
                    >
                      <Dialog.Overlay>
                        <div className="fixed inset-0 bg-slate-1 opacity-50" />
                      </Dialog.Overlay>
                      <Dialog.Panel className="absolute z-30 top-[25%] left-[50%] translate-x-[-50%] translate-y-[-25%] w-[400px]">
                        <div className="flex flex-col bg-slate-2 border border-slate-4 rounded-[8px] w-full p-[24px] text-slate-12">
                          {/* Close */}
                          <div className="rounded-[4px] text-[13px] absolute right-[16px] top-[16px] z-40">
                            <button
                              onClick={() => {
                                closeDeleteDialog();
                              }}
                              className="text-slate-11 hover:bg-slate-4 rounded-md h-[24px] w-[24px] ml-[12px] flex items-center justify-center"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          <Dialog.Title className="text-[14px]">
                            Delete connection
                          </Dialog.Title>
                          <Dialog.Description className="text-[13px] mt-[16px] gap-2 flex flex-col">
                            {tablesFromConnectionData &&
                              tablesFromConnectionData.length > 0 && (
                                <div className="">
                                  This connection has{" "}
                                  {tablesFromConnectionData.length} tables
                                  associated with it. <br />
                                  Deleting this connection will disconnect these
                                  tables from getting updates.
                                </div>
                              )}
                            <div>
                              Are you sure you want to delete this connection?
                              This action is irreversible.
                            </div>
                          </Dialog.Description>
                          <div className="font-mono w-full break-all bg-slate-3 text-slate-12 border border-slate-4 rounded-md font-medium text-[13px] px-[8px] py-[4px] mt-[12px]">
                            {selectedConnection.name}
                          </div>
                          <div className="flex w-full justify-end mt-[24px] gap-2">
                            <button
                              className="ml-auto bg-slate-3 hover:bg-slate-4 text-[13px] text-slate-12 px-[12px] py-[4px] rounded-[4px]"
                              onClick={() => {
                                closeDeleteDialog();
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              className="bg-red-5 hover:bg-red-6 border-red-7 border text-[13px] text-slate-12 px-[12px] py-[4px] rounded-[4px]"
                              onClick={() => {
                                handleDeleteConnection();
                                closeDeleteDialog();
                              }}
                            >
                              Delete
                            </button>
                          </div>
                          {deleteErrorMessage && (
                            <div className="text-red-5 text-[13px] mt-[12px]">
                              {deleteErrorMessage}
                            </div>
                          )}
                        </div>
                      </Dialog.Panel>
                    </Dialog>
                    {selectedConnectionId &&
                      selectedConnection?.connectionType === "snowflake" && (
                        <div className="flex flex-col gap-4 w-full">
                          <div className="flex flex-row gap-3 text-[13px] relative">
                            <p className="min-w-[180px] text-slate-11">
                              Display name
                            </p>
                            {isEditingDisplayName ? (
                              <div
                                className="absolute ml-[192px]"
                                style={{
                                  transform: `translateY(-6px) translateX(-8px)`,
                                }}
                              >
                                <input
                                  title="Display name"
                                  type="text"
                                  value={displayNameInputValue}
                                  onChange={(e) =>
                                    setDisplayNameInputValue(e.target.value)
                                  }
                                  className="border border-blue-700 rounded-md text-slate-12 bg-transparent py-[2px] px-[8px] mr-2 text-[13px] w-[240px]"
                                  ref={displayNameInputRef}
                                  onBlur={handleUpdateDisplayName}
                                  onKeyDown={(e) => {
                                    console.log(e.key);
                                    if (e.key === "Enter") {
                                      handleUpdateDisplayName();
                                    }
                                    if (e.key === "Escape") {
                                      setDisplayNameInputValue(
                                        selectedConnection?.name || ""
                                      );
                                      setIsEditingDisplayName(false);
                                    }
                                  }}
                                />
                                <button
                                  onClick={() => {
                                    setIsEditingDisplayName(false);
                                  }}
                                  className="text-slate-10"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <>
                                <p>{selectedConnection?.name}</p>

                                <div
                                  className="flex flex-row items-center gap-1 cursor-pointer text-[12px] text-slate-10"
                                  onClick={() => {
                                    setDisplayNameInputValue(
                                      selectedConnection?.name || ""
                                    );
                                    setIsEditingDisplayName(true);
                                    displayNameInputRef?.current?.focus();
                                  }}
                                >
                                  <PencilSimpleLine size={16} weight="fill" />
                                  Edit
                                </div>
                              </>
                            )}
                          </div>
                          <div className="flex flex-row gap-3 text-[13px]">
                            <p className="min-w-[180px] text-slate-11">
                              Account identifier
                            </p>
                            <p>{selectedConnection?.accountIdentifier}</p>
                          </div>
                          <div className="flex flex-row gap-3 text-[13px]">
                            <p className="min-w-[180px] text-slate-11">
                              Warehouse
                            </p>
                            <p>{selectedConnection?.warehouse}</p>
                          </div>
                          <div className="flex flex-row gap-3 text-[13px]">
                            <p className="min-w-[180px] text-slate-11">
                              Created at
                            </p>
                            <p>
                              {formatFriendlyDate(
                                selectedConnection?.createdAt
                              )}
                            </p>
                          </div>
                          <div className="flex flex-row gap-3 text-[13px]">
                            <p className="min-w-[180px] text-slate-11">Role</p>
                            <p>{selectedConnection?.role}</p>
                          </div>
                          <div className="flex flex-row gap-3 text-[13px]">
                            <p className="min-w-[180px] text-slate-11">
                              Username
                            </p>
                            <p>{selectedConnection?.basicAuthUsername}</p>
                          </div>
                          <div className="flex flex-row gap-3 text-[13px]">
                            <p className="min-w-[180px] text-slate-11">
                              Connection type
                            </p>
                            <div className="flex flex-row gap-2 items-center">
                              <div className="h-[20px] w-[20px]">
                                <LogoSnowflake />
                              </div>
                              <p>Snowflake</p>
                            </div>
                          </div>
                          <div className="flex flex-row gap-3 text-[13px]">
                            <p className="min-w-[180px] text-slate-11">
                              Connection ID
                            </p>
                            <p className="">{selectedConnection?.id}</p>
                          </div>
                        </div>
                      )}
                    <div className="w-full">
                      {selectedConnectionId && tablesFromConnectionData && (
                        <>
                          <div className="flex flex-row gap-3 mt-8 text-[14px] items-center mb-4">
                            Connected tables{" "}
                            <div className="text-[12px] px-[4px] py-[2px] bg-slate-3">
                              {tablesFromConnectionData.length}
                            </div>
                          </div>
                          {tablesFromConnectionData.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-32 bg-slate-2 rounded-lg">
                              <p className="text-slate-11 text-[14px]">
                                No connected tables
                              </p>
                            </div>
                          )}
                          {tablesFromConnectionData.length > 0 && (
                            <div className="flex flex-col border-slate-4 rounded-lg border overflow-clip">
                              {tablesFromConnectionData.map(
                                (table: any, index: number) => (
                                  <Link
                                    key={table.id}
                                    href={`/workspace/${currentWorkspace.id}/table/${table.id}`}
                                  >
                                    <div
                                      className={`flex flex-row gap-4 items-center ${
                                        index <
                                        tablesFromConnectionData.length - 1
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
                                      <div className="w-[180px] truncate">
                                        {table.displayName}
                                      </div>
                                      <pre className="px-2 py-1 bg-slate-3 rounded-sm text-slate-11 text-[11px] truncate">
                                        {table.connectionPath}
                                      </pre>
                                      <div className="ml-auto">
                                        {abbreviateNumber(table.rowCount) +
                                          " rows"}
                                      </div>
                                    </div>
                                  </Link>
                                )
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {selectedConnectionId == null && (
            <div className="flex flex-col items-center justify-center h-screen">
              <p className="text-slate-11 text-[14px]">
                No connection selected
              </p>
            </div>
          )}
        </div>
      </div>
    </WorkspaceLayout>
  );
}
