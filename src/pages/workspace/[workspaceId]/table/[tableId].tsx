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
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { IconLoaderFromSvgString } from "@/components/IconLoaderFromSvgString";
import IconPickerPopoverInline from "@/components/IconPickerPopoverInline";

function EditTableDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger tabIndex={-1}>
        <div className="bg-slate-2 hover:bg-slate-3 text-[13px] pl-[8px] pr-[12px] py-[6px] border border-slate-4 rounded-[4px] cursor-pointer flex flex-row gap-[6px] items-center">
          <Gear size={16} className="text-slate-11" weight="fill" />
          Config
        </div>
      </Dialog.Trigger>
      <Dialog.Portal className="z-100">
        <Dialog.Overlay className="z-20 bg-slate-1 opacity-75 fixed inset-0" />
        <Dialog.Content className="z-30 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] max-w-[90vw] w-[1000px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-slate-2 border border-slate-3 text-slate-12 p-5 focus:outline-none overflow-hidden">
          <Dialog.Title className="m-0 text-[14px] font-medium">
            Edit table config
          </Dialog.Title>
          <div className="h-[85vh] overflow-scroll mt-4 rounded-sm">Hello</div>
          <div className="mt-5 flex justify-end">
            <Dialog.Close asChild>
              <button className="px-4 py-3 bg-slate-3 rounded-md text-[13px] font-medium leading-none focus:outline-none hover:bg-slate-4">
                Close preview
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button
              className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <X size={16} weight="bold" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default function TablePage() {
  const router = useRouter();
  const { tableId } = router.query;

  console.log("id", tableId);

  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleFocus = () => {
    setIsSearchFocused(true);
  };

  const handleBlur = () => {
    setIsSearchFocused(false);
  };

  const handleKeyDown = (e: any) => {
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
          <div className="flex flex-row gap-2 items-center justify-center">
            <IconPickerPopoverInline
              iconSvgString={tableData.iconSvgString}
              tableName={tableData.displayName}
              tableId={tableData.id}
              workspaceId={currentWorkspace?.id}
            />
            <p className="text-slate-12 text-[13px]">{tableData.displayName}</p>
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
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
              />
            </div>
            <EditTableDialog />
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
