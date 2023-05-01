import { useRouter } from "next/router";
import { getTable, getConnection } from "../../../../utils/api";
import { useQuery } from "@tanstack/react-query";
import { useCurrentUser } from "../../../../hooks/useCurrentUser";
import { useCurrentWorkspace } from "../../../../hooks/useCurrentWorkspace";
import WorkspaceLayout from "../../../../components/WorkspaceLayout";
import MockTable from "../../../../components/MockTable";
import LogoSnowflake from "@/components/LogoSnowflake";
import LogoBigQuery from "@/components/LogoBigQuery";
import LogoPostgres from "@/components/LogoPostgres";
import { table } from "console";

export default function Table() {
  const router = useRouter();
  const { tableId } = router.query;

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
    data: tableData,
    isLoading: isTableLoading,
    error: tableError,
  } = useQuery({
    queryKey: ["getTable", currentWorkspace?.id, tableId],
    queryFn: async () => {
      const response = await getTable(currentWorkspace?.id, tableId);
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
      <div className="h-screen bg-slate-1 text-slate-12 text-[11px] text-slate-11 flex items-center justify-center">
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
        <div className="flex flex-row gap-2 items-center  py-[12px] px-[20px]">
          <p className="text-slate-12 text-[13px]">{tableData.displayName}</p>
          <pre className="px-2 py-1 bg-slate-4 rounded-sm text-slate-11 text-[11px]">
            {tableData.connectionPath}
          </pre>
        </div>
        <div className="grow-1 overflow-x-auto overflow-y-scroll ">
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
