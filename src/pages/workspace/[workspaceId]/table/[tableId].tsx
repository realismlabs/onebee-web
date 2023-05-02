import { useRouter } from "next/router";
import { getTable, getConnection } from "../../../../utils/api";
import { assignColor } from "@/utils/util";
import { useQuery } from "@tanstack/react-query";
import { useCurrentUser } from "../../../../hooks/useCurrentUser";
import { useCurrentWorkspace } from "../../../../hooks/useCurrentWorkspace";
import WorkspaceLayout from "../../../../components/WorkspaceLayout";
import MockTable from "../../../../components/MockTable";
import LogoSnowflake from "@/components/LogoSnowflake";
import LogoBigQuery from "@/components/LogoBigQuery";
import LogoPostgres from "@/components/LogoPostgres";
import { CaretDown, MagnifyingGlass, Gear, X } from "@phosphor-icons/react";
import { useState, Fragment } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { IconLoaderFromSvgString } from "@/components/IconLoaderFromSvgString";
import IconPickerPopoverInline from "@/components/IconPickerPopoverInline";
import { Popover, Transition } from "@headlessui/react";

const TablePopover = ({ tableName }: { tableName: string }) => {
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={`text-slate-11 hover:bg-slate-3 focus:shadow-slate-7 flex flex-row gap-[4px] px-[8px] py-[4px] items-center justify-center rounded-[4px] focus:outline-none 
            ${open ? "bg-slate-3" : "hover:bg-slate-3 active:bg-slate-4"}`}
          >
            <p className="text-slate-12 text-[13px]">{tableName}</p>
            <CaretDown size={12} weight="bold" className="mt-[2px]" />
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-10 w-[200px] max-w-[90vw] bg-slate-2 rounded-md shadow-slate-7 border border-slate-3 text-slate-12 focus:outline-none text-[13px]">
              <div className="flex flex-col px-[8px] py-[8px] w-full text-[13px] text-slate-12">
                <>
                  <Popover.Button className="w-full">
                    <button className="hover:bg-slate-4 px-[8px] py-[6px] text-left flex flex-row gap-3 w-full rounded-md items-center">
                      Rename table
                    </button>
                  </Popover.Button>
                  <Popover.Button className="w-full">
                    <button className="hover:bg-slate-4 px-[8px] py-[6px] text-left flex flex-row gap-3 w-full rounded-md items-center">
                      Delete table
                    </button>
                  </Popover.Button>
                </>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default function TablePage() {
  const router = useRouter();
  const { tableId } = router.query;

  console.log("id", tableId);

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isEditPopoverOpen, setIsEditPopoverOpen] = useState(false);
  const [isRenamePopoverOpen, setIsRenamePopoverOpen] = useState(false);

  const openRenamePopover = () => {
    setIsRenamePopoverOpen(true);
    console.log("open rename popover");
    console.log("isRenamePopoverOpen", isRenamePopoverOpen);
  };

  const handleSearchbarFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchbarBlur = () => {
    setIsSearchFocused(false);
  };

  const handleSearchbarKeyDown = (e: any) => {
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
      const response = await getTable(currentWorkspace?.id, tableId);
      console.log("awu response", JSON.stringify(response));
      return response;
    },
    enabled: currentWorkspace?.id !== null,
  });

  const {
    data: connectionData,
    isLoading: isConnectionLoading,
    error: connectionError,
  } = useQuery({
    queryKey: ["getConnection", currentWorkspace?.id, tableData?.connectionId],
    queryFn: async () => {
      const response = await getConnection(
        currentWorkspace.id,
        tableData.connectionId
      );
      return response;
    },
    enabled: currentWorkspace?.id !== null && tableData?.connectionId !== null,
  });

  if (isTableLoading || isConnectionLoading) {
    return (
      <div className="h-screen bg-slate-1 text-slate-12 text-[11px] flex items-center justify-center">
        Loading..
      </div>
    );
  }

  if (tableError || connectionError) {
    return <div>There was an error loading your table</div>;
  }

  return (
    <WorkspaceLayout>
      <div className="bg-slate-1 max-h-screen text-slate-12 flex flex-col divide-slate-4 divide-y">
        <div className="flex flex-row gap-2 items-center py-[12px] px-[12px] h-[48px]">
          <div className="flex flex-row items-center justify-center">
            <IconPickerPopoverInline
              iconSvgString={tableData.iconSvgString}
              tableName={tableData.displayName}
              tableId={tableData.id}
              workspaceId={currentWorkspace?.id}
            />
            <TablePopover tableName={tableData.displayName} />
          </div>
          <div className="flex flex-row gap-2 ml-auto">
            <div className="bg-slate-2 hover:bg-slate-3 text-[13px] px-[12px] py-[6px] border border-slate-4 cursor-pointer rounded-[6px] flex flex-row gap-1 items-center">
              <p>Columns</p>
              <CaretDown size={12} className="text-slate-11" />
            </div>
            <div
              className={`w-[480px] bg-slate-2 hover:bg-slate-3 text-[13px] px-[6px] py-[6px] border border-slate-4 ${
                isSearchFocused ? "ring-2 ring-blue-600" : ""
              } cursor-pointer rounded-[6px] flex flex-row gap-1 items-center`}
            >
              <MagnifyingGlass size={16} className="text-slate-11" />
              <input
                title="Search"
                className="bg-transparent focus:outline-none focus:ring-0 placeholder:text-slate-10"
                placeholder="Search.."
                onFocus={handleSearchbarFocus}
                onBlur={handleSearchbarBlur}
                onKeyDown={handleSearchbarKeyDown}
              />
            </div>
          </div>
        </div>
        <div className="grow-1 overflow-x-auto overflow-y-scroll max-w-screen">
          <MockTable />
        </div>
        <div className="flex flex-row gap-2 items-center border-b border-slate-4 px-[20px] py-[8px] text-[13px] text-slate-11">
          <div>Full path</div>

          <div>{tableData.fullName}</div>
          <div>from</div>
          <div className="flex flex-row gap-1 items-center">
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
  );
}
