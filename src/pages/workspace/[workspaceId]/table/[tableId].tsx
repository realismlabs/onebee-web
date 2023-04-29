import { useRouter } from "next/router";
import { getTable } from "../../../../utils/api";
import { useQuery } from "@tanstack/react-query";
import { useCurrentUser } from "../../../../hooks/useCurrentUser";
import { useCurrentWorkspace } from "../../../../hooks/useCurrentWorkspace";
import WorkspaceLayout from "../../../../components/WorkspaceLayout";
import MockTable from "../../../../components/MockTable";

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

  if (isTableLoading) {
    return <div className="h-screen bg-slate-1 text-white"></div>;
  }

  if (tableError) {
    return <div>There was an error loading your table</div>;
  }

  return (
    <WorkspaceLayout>
      <div className="bg-slate-1 max-h-screen text-white flex flex-col divide-slate-4 divide-y">
        <div className="flex flex-row gap-2 items-center border-b border-slate-4 py-[12px] px-[20px]">
          <p className="text-white text-[13px]">{tableData.displayName}</p>
          <pre className="px-2 py-1 bg-slate-4 rounded-sm text-slate-11 text-[11px]">
            {tableData.connectionPath}
          </pre>
        </div>
        <div className="grow-1 overflow-x-auto overflow-y-scroll ">
          <MockTable />
        </div>
        <div className="flex flex-row gap-2 items-center border-b border-slate-4 px-[20px] py-[8px] text-[13px]">
          Hello
        </div>
      </div>
    </WorkspaceLayout>
  );
}
