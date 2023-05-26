import { useRouter } from "next/router";
import Head from "next/head";
import { getTable, getConnection, updateTable, deleteTable } from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCurrentWorkspace } from "@/hooks/useCurrentWorkspace";
import WorkspaceLayout from "@/components/WorkspaceLayout";
import MemoizedMockTable from "@/components/MemoizedMockTable";
import LogoSnowflake from "@/components/LogoSnowflake";
import LogoBigQuery from "@/components/LogoBigQuery";
import LogoPostgres from "@/components/LogoPostgres";
import { CaretDown, MagnifyingGlass, Gear, X, Pencil, Trash, ClockCounterClockwise } from "@phosphor-icons/react";
import { useState, Fragment, useRef, useEffect } from "react";
import IconPickerPopoverEditTable from "@/components/IconPickerPopoverEditTable";
import { Popover, Transition, Dialog } from "@headlessui/react";
import InvitePeopleDialog from "@/components/InvitePeopleDialog";
import { useAuth } from "@clerk/nextjs";
import { useLocalStorageState } from "@/utils/util"

const TablePopover = ({
  tableName,
  tableId,
  workspaceId,
}) => {
  const { getToken } = useAuth();
  const router = useRouter();
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);

  const openRenameDialog = () => {
    setDisplayNameInputError("");
    setDisplayNameInputValue(tableName);
    setIsRenameDialogOpen(true);
  };

  const closeRenameDialog = () => {
    setIsRenameDialogOpen(false);
  };

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };


  const displayNameInputRef = useRef(null);
  const [selectedConnectionId, setSelectedConnectionId] = useState(null);
  const [displayNameInputValue, setDisplayNameInputValue] = useState(tableName);
  const [isEditingDisplayName, setIsEditingDisplayName] = useState(false);
  const [displayNameInputError, setDisplayNameInputError] = useState("");

  const handleUpdateDisplayName = async (e) => {
    const new_table_name = e.target.value;
    if (new_table_name === "") {
      setDisplayNameInputError("Name cannot be empty");
      return;
    } else if (new_table_name === tableName) {
      setIsEditingDisplayName(false);
      closeRenameDialog();
      return;
    } else if (new_table_name.length > 64) {
      setDisplayNameInputError("Name cannot be longer than 64 characters");
      return;
    } else {
      setDisplayNameInputError("");
    }
    const tableData = {
      name: new_table_name,
    };
    try {
      const jwt = await getToken({ template: "test" });
      await updateTableMutation.mutateAsync({ workspaceId, tableId, tableData, jwt });
      setIsEditingDisplayName(false);
      closeRenameDialog();
    } catch (error) {
      console.error('Error updating table:', error);
    }
  };

  const handleDeleteTable = async () => {
    try {
      const jwt = await getToken({ template: "test" });
      await deleteTableMutation.mutateAsync({ workspaceId, tableId, jwt });
      closeDeleteDialog();
    } catch (error) {
      console.error('Error deleting table:', error);
    }
  };

  const queryClient = useQueryClient();

  const updateTableMutation = useMutation(updateTable, {
    onSuccess: async (updatedTable) => {
      console.log("Table updated:", updatedTable);
      await queryClient.refetchQueries([
        "getTable",
        workspaceId,
        String(tableId),
      ]);
      await queryClient.refetchQueries(["getTables", workspaceId]);
    },
    onError: (error) => {
      console.error("Error updating table:", error);
    },
    invalidateQueries: [
      ["getTable", workspaceId, tableId],
      ["getTables", workspaceId],
    ],
  });

  const deleteTableMutation = useMutation(deleteTable, {
    onSuccess: async (deletedTable) => {
      console.log("Table deleted:", deletedTable);
      await queryClient.refetchQueries(["getTables", workspaceId]);
      router.push(`/workspace/${workspaceId}`);
    },
    onError: (error) => {
      console.error("Error deleting table:", error);
    },
    invalidateQueries: [["getTables", workspaceId]],
  });

  return (
    <>
      <Popover className="relative">
        {({ open }) => (
          <>
            <div className='w-[240px]'>
              <Popover.Button
                className={`max-w-[240px] text-slate-11 hover:bg-slate-3 focus:shadow-slate-7 flex flex-row gap-[4px] px-[8px] py-[4px] items-center justify-start rounded-[4px] focus:outline-none
                ${open ? "bg-slate-3" : "hover:bg-slate-3 active:bg-slate-4"}`}
              >
                <p className="text-slate-12 text-[13px] truncate">{tableName}</p>
                <CaretDown size={12} weight="bold" className="mt-[2px] min-h-[12px] min-w-[12px]" />
              </Popover.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-75"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-75"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-10 w-[200px] max-w-[90vw] bg-slate-2 rounded-md shadow-slate-7 border border-slate-4 text-slate-12 focus:outline-none text-[13px]">
                <div className="flex flex-col px-[8px] py-[8px] w-full text-[13px] text-slate-12">
                  <>
                    <Popover.Button className="w-full">
                      <button
                        className="hover:bg-slate-4 px-[8px] py-[6px] text-left flex flex-row gap-3 w-full rounded-md items-center"
                        onClick={openRenameDialog}
                      >
                        <div className="flex flex-row w-full gap-2 items-center">
                          <Pencil size={16} weight="fill" className="text-slate-10" />
                          Rename table
                        </div>
                      </button>
                    </Popover.Button>
                    <Popover.Button className="w-full">
                      <button className="hover:bg-slate-4 px-[8px] py-[6px] text-left flex flex-row gap-3 w-full rounded-md items-center"
                        onClick={openDeleteDialog}
                      >
                        <div className="flex flex-row w-full gap-2 items-center">
                          <Trash size={16} weight="bold" className="text-slate-10" />
                          Delete table
                        </div>
                      </button>
                    </Popover.Button>
                  </>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
      <Dialog
        as="div"
        open={isRenameDialogOpen}
        onClose={() => setIsRenameDialogOpen(false)}
        className="absolute z-20 inset-0 h-fit ml-[270px] mt-[40px]"
      >
        <Dialog.Panel>
          <div className="flex flex-col bg-slate-3 w-fit rounded-[8px]">
            <div className="p-[8px] rounded-[4px] text-[13px] flex flex-row items-center">
              <input
                title="Display name"
                type="text"
                value={displayNameInputValue}
                onChange={(e) => setDisplayNameInputValue(e.target.value)}
                className="border border-blue-700 rounded-md text-slate-12 bg-transparent py-[2px] px-[8px] text-[13px] w-[240px]"
                ref={displayNameInputRef}
                onBlur={handleUpdateDisplayName}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUpdateDisplayName(e);
                  }
                  if (e.key === "Escape") {
                    setDisplayNameInputValue(tableName || "");
                    setIsEditingDisplayName(false);
                  }
                }}
              />
              <button
                onClick={() => {
                  setIsEditingDisplayName(false);
                  closeRenameDialog();
                }}
                className="text-slate-10 hover:bg-slate-2 h-[20px] w-[20px] ml-[12px] flex items-center"
              >
                <X size={16} />
              </button>
            </div>
            {displayNameInputError && (
              <div className="text-red-9 px-[8px] pb-[4px] text-[12px]">
                {displayNameInputError}
              </div>
            )}
          </div>
        </Dialog.Panel>
      </Dialog>
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
            <Dialog.Title className="text-[14px]">Delete table</Dialog.Title>
            <Dialog.Description className="text-[13px] mt-[16px]">Are you sure you want to delete this table? <br />This action is irreversible.</Dialog.Description>
            <div className="font-mono w-full break-all bg-slate-3 text-slate-12 border border-slate-4 rounded-md font-medium text-[13px] px-[8px] py-[4px] mt-[12px]">{tableName}</div>
            <div className="flex w-full justify-end mt-[24px] gap-2">
              <button
                className="ml-auto bg-slate-3 hover:bg-slate-4 text-[13px] text-slate-12 px-[12px] py-[4px] rounded-[4px]"
                onClick={() => {
                  closeDeleteDialog();
                }
                }
              >
                Cancel
              </button>
              <button
                className="bg-red-5 hover:bg-red-6 border-red-7 border text-[13px] text-slate-12 px-[12px] py-[4px] rounded-[4px]"
                onClick={() => {
                  handleDeleteTable();
                  closeDeleteDialog();
                }
                }
              >
                Delete
              </button>
            </div>
            {displayNameInputError && (
              <div className="text-red-9 px-[8px] pb-[4px] text-[12px]">
                {displayNameInputError}
              </div>
            )}
          </div>
        </Dialog.Panel>
      </Dialog>
    </>
  );
};

const KeyCombination = ({ keys }) => {
  const isMac = window.navigator.userAgent.includes('Mac');

  return (
    <div className="flex flex-row gap-1">
      {keys.map((key, index) => {
        let displayKey = key;
        if (key.toLowerCase() === 'cmd' || key.toLowerCase() === 'meta') {
          displayKey = isMac ? '⌘' : 'Ctrl';
        }
        return (
          <p key={index} className="min-h-[20px] min-w-[20px] bg-slate-3 flex items-center justify-center rounded-[3px] text-slate-11">{displayKey}</p>
        );
      })}
    </div>
  );
};

export default function TablePage() {
  const { getToken } = useAuth();
  const router = useRouter();
  const { tableId } = router.query;
  const searchRef = useRef(null);
  const inputRef = useRef(null);


  const [isInvitePeopleDialogOpen, setIsInvitePeopleDialogOpen] = useState(false);
  const [customInviteMessage, setCustomInviteMessage] = useState(
    "Hi there, \n\nWe're using Dataland.io as an easy and fast way to browse data from our data warehouse. \n\nJoin the workspace in order to browse and search our key datasets."
  );

  console.log("id", tableId);

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isEditPopoverOpen, setIsEditPopoverOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [onboardingTableHint, setOnboardingTableHint] = useLocalStorageState("onboardingTableHint", false);

  const handleSearchbarFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchbarBlur = () => {
    setIsSearchFocused(false);
  };

  const handleSearchbarKeyDown = (e) => {
    if (e.key === "Escape") {
      e.target.blur();
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
    data: tableData,
    isLoading: isTableLoading,
    error: tableError,
  } = useQuery({
    queryKey: ["getTable", currentWorkspace?.id, tableId],
    queryFn: async () => {
      const jwt = await getToken({ template: "test" });
      const response = await getTable(currentWorkspace?.id, tableId, jwt);
      return response;
    },
    enabled: !!currentWorkspace?.id,
  });

  const {
    data: connectionData,
    isLoading: isConnectionLoading,
    error: connectionError,
  } = useQuery({
    queryKey: ["getConnection", currentWorkspace?.id, tableData?.connectionId],
    queryFn: async () => {
      const jwt = await getToken({ template: "test" });
      const response = await getConnection(
        currentWorkspace.id,
        tableData.connectionId,
        jwt
      );
      return response;
    },
    enabled: !!currentWorkspace?.id && !!tableData?.connectionId,
  });


  // use useEffect to update the customMessage with the table name
  useEffect(() => {
    if (tableData) {
      setCustomInviteMessage(
        `Hi! Check out the ${tableData.name} table on our workspace in Dataland.io. \n\nWe're using Dataland.io as an easy and fast way to browse data from our data warehouse.`
      );
    }
  }, [tableData]);

  // useEffect to use Escape key to exit search
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsSearchFocused(false);
      }
    }

    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsSearchFocused]);


  // If user clicks on search, focus on input
  useEffect(() => {
    if (isSearchFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchFocused]);


  // Cmd/Ctrl + F to focus on search
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'f') {
        event.preventDefault();  // prevent the browser's default search box
        setIsSearchFocused(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);



  if (isTableLoading || isConnectionLoading) {
    return (
      <>
        <Head>
          <title>Dataland</title>
        </Head>
        <WorkspaceLayout>
          <div className="bg-slate-1 max-h-screen text-slate-12 flex flex-col divide-slate-4 divide-y">
            <div className="flex flex-row gap-2 items-center py-[12px] pl-[12px] h-[48px]">
              <div className="flex flex-row items-center justify-center gap-2">
                <div className="skeleton animate-pulse bg-slate-4 rounded-md h-[24px] w-[24px]"><div className="opacity-0">Invisible skeleton</div></div>
                <div className="skeleton animate-pulse bg-slate-4 rounded-md w-48"><div className="opacity-0">Invisible skeleton</div></div>
              </div>
              <div className="ml-auto flex flex-row gap-2 flex-none justify-end">
                <div className="bg-slate-3 hover:bg-slate-4 text-slate-11 text-[13px] px-[12px] py-[6px] border border-slate-4 cursor-pointer rounded-[6px] flex flex-row gap-1 items-center">
                  <p>Columns</p>
                  <CaretDown size={12} className="text-slate-11" />
                </div>
                <div className="bg-slate-3 hover:bg-slate-4 text-slate-11 text-[13px] px-[12px] py-[6px] cursor-pointer rounded-[6px] flex flex-row gap-1 items-center"
                  onClick={() => setIsInvitePeopleDialogOpen(true)}>
                  <p>Share</p>
                </div>
              </div>
            </div>
            <div className="grow-1 overflow-x-auto overflow-y-scroll max-w-screen h-screen items-center justify-center flex text-[11px]">
              Loading..
            </div>
            <div className="flex flex-row gap-2 items-center border-b border-slate-4 px-[20px] py-[8px] text-[13px] text-slate-11">
              <div className="skeleton animate-pulse bg-slate-4 rounded-md w-48"><div className="opacity-0">Invisible skeleton</div></div>
            </div>
          </div>
        </WorkspaceLayout>
      </>
    );
  }

  if (tableError || connectionError) {
    return <div>There was an error loading your table</div>;
  }

  const example_column_names = [
    "order_id",
    "order_amount",
    "payment_status",
    "fulfillment_status",
    "sku_list",
    "customer_id",
    "customer_email",
  ]

  const example_recent_searches = [
    "arthurwu1",
    "Wu",
    "Zuo",
    "rust",
    "commenting",
    "29318923",
  ]


  return (
    <>
      <Head>
        <title>Dataland</title>
      </Head>
      <WorkspaceLayout>
        <div className="bg-slate-1 max-h-screen text-slate-12 flex flex-col divide-slate-4 divide-y">
          <div className="flex flex-row gap-2 items-center py-[12px] pl-[12px] h-[48px]">
            <div className="flex flex-row items-center justify-center">
              <IconPickerPopoverEditTable
                iconSvgString={tableData.iconSvgString}
                tableName={tableData.name}
                tableId={tableData.id}
                workspaceId={currentWorkspace?.id}
              />
              <TablePopover
                tableName={tableData.name}
                tableId={tableData.id}
                workspaceId={currentWorkspace?.id}
              />
            </div>
            {/* Search */}
            {isSearchFocused ? (
              <>
                <div
                  ref={searchRef}
                  className="flex flex-col flex-grow mx-[120px]"
                  onClick={() => setIsSearchFocused(true)}
                  style={{ width: '100%' }}  // Explicitly set width to 100%
                >
                  <div className="relative m-[-6px] p-[6px] bg-slate-3 rounded-t-[20px]">
                    <div
                      className={`bg-slate-5 hover:bg-slate-6 text-[13px] px-[8px] py-[6px] border-2 border-slate-6  ${isSearchFocused ? "ring-2 ring-blue-600" : ""
                        } cursor-pointer rounded-full gap-2 flex flex-grow items-center`}
                    >
                      <MagnifyingGlass size={16} weight="bold" className="text-slate-11" />
                      <input
                        ref={inputRef}
                        title="Search"
                        className="bg-transparent focus:outline-none focus:ring-0 placeholder:text-slate-11 flex-grow"
                        placeholder={`Search ${tableData.name}..`}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onFocus={handleSearchbarFocus}
                        onBlur={handleSearchbarBlur}
                        onKeyDown={handleSearchbarKeyDown}
                      />
                      <KeyCombination keys={['cmd', 'F']} />
                    </div>
                    <div className="h-auto mt-1 mx-[-6px] px-4 py-3 rounded-b-[20px] absolute bg-slate-3 w-full text-white shadow-2xl">
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-row gap-2">
                          <p className="text-slate-11 text-[12px]">Search by column</p>
                          <p className="text-slate-10 text-[12px] flex-grow">Or type `column:` in the searchbar</p>
                          <p className="text-slate-12 text-[12px]">Advanced search</p>
                        </div>
                        <div className="flex flex-row gap-2 overflow-x-scroll">
                          {example_column_names.map((column_name) => {
                            return (
                              <div
                                key={column_name}
                                className="bg-slate-1 hover:bg-slate-2 text-[13px] px-[8px] py-[4px] border border-slate-4 cursor-pointer rounded-md gap-2 flex items-center"
                              >
                                <p className="text-slate-12">{column_name}</p>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 mt-4">
                        <div className="flex flex-row gap-2">
                          <p className="text-slate-11 text-[12px]">Recent searches</p>
                        </div>
                        <div className="flex flex-row gap-2 overflow-x-scroll">
                          {/* set up grid 3 column layout, make each column take up as kmuch space as*/}
                          <div className="grid grid-cols-3 gap-2 w-full">
                            {example_recent_searches.map((recent_search) => {
                              return (
                                <div
                                  key={recent_search}
                                  className="hover:bg-slate-5 text-[13px] py-[4px] cursor-pointer rounded-md gap-2 flex flex-grow items-center"
                                >
                                  <ClockCounterClockwise size={16} weight="bold" className="text-slate-11" />
                                  <p className="text-slate-12">{recent_search}</p>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div
                  ref={searchRef}
                  className="flex flex-col flex-grow mx-[120px]"
                  onClick={() => setIsSearchFocused(true)}
                  style={{ width: '100%' }}  // Explicitly set width to 100%
                >
                  <div
                    className={`bg-slate-5 hover:bg-slate-6 text-[13px] px-[8px] py-[6px] border-2 border-slate-6  ${isSearchFocused ? "ring-2 ring-blue-600" : ""
                      } cursor-pointer rounded-full gap-2 flex flex-grow items-center`}
                  >
                    <MagnifyingGlass size={16} weight="bold" className="text-slate-11" />
                    <input
                      ref={inputRef}
                      title="Search"
                      className="bg-transparent focus:outline-none focus:ring-0 placeholder:text-slate-11 flex-grow"
                      placeholder={`Search ${tableData.name}..`}
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      onFocus={handleSearchbarFocus}
                      onBlur={handleSearchbarBlur}
                      onKeyDown={handleSearchbarKeyDown}
                    />
                    <KeyCombination keys={['cmd', 'F']} />
                  </div>
                </div>
              </>
            )}


            <div className="flex flex-row gap-2 flex-none justify-end">
              <div className="bg-slate-3 hover:bg-slate-4 text-slate-11 text-[13px] px-[12px] py-[6px] border border-slate-4 cursor-pointer rounded-[6px] flex flex-row gap-1 items-center">
                <p>Columns</p>
                <CaretDown size={12} className="text-slate-11" />
              </div>
              <div className="bg-slate-3 hover:bg-slate-4 text-slate-11 text-[13px] px-[12px] py-[6px] cursor-pointer rounded-[6px] flex flex-row gap-1 items-center"
                onClick={() => setIsInvitePeopleDialogOpen(true)}>
                <p>Share</p>
              </div>
              <InvitePeopleDialog
                isInvitePeopleDialogOpen={isInvitePeopleDialogOpen}
                setIsInvitePeopleDialogOpen={setIsInvitePeopleDialogOpen}
                currentUser={currentUser}
                currentWorkspace={currentWorkspace}
                customMessage={customInviteMessage}
                setCustomMessage={setCustomInviteMessage}
                emailTemplateLanguage={""}
                customInvitePeopleDialogHeader={`Share ${tableData.name} with your team`}
                customInvitePeopleSubject={`${currentUser.name} shared ${tableData.name} with you on Dataland.io`}
              />
            </div>
          </div>
          <div className="grow-1 overflow-x-auto overflow-y-scroll max-w-screen">
            <MemoizedMockTable />
          </div>
          <div className="flex flex-row gap-2 items-center border-b border-slate-4 px-[20px] py-[8px] text-[13px] text-slate-11">
            <div>Table synced from</div>
            <div className="font-mono text-[12px]">{tableData.fullPath?.replaceAll(".", "/")}</div>
            <div>from</div>
            <div className="flex flex-row gap-2 items-center">
              {" "}
              {connectionData.connectionType === "snowflake" && (
                <div className="h-[16px] w-[16px]">
                  <LogoSnowflake />
                </div>
              )}
              {connectionData.name}
            </div>
          </div>
        </div>
      </WorkspaceLayout>
    </>
  );
}
