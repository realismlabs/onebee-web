import { useRouter } from 'next/router';
import { getTable } from '../../utils/api';
import { useQuery } from '@tanstack/react-query';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useCurrentWorkspace } from '../../hooks/useCurrentWorkspace';
import WorkspaceLayout from '../../components/WorkspaceLayout';

export default function Table() {
  const router = useRouter();
  const { id } = router.query;

  console.log("id", id);

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
    queryKey: ["getTable", currentWorkspace?.id, id],
    queryFn: async () => {
      console.log("currentWorkspace?.id", currentWorkspace?.id, "id", id);
      const response = await getTable(currentWorkspace?.id, id)
      return response;
    },
    enabled: currentWorkspace?.id !== null,
  });


  if (isTableLoading) {
    return <div>Loading...</div>;
  }

  if (tableError) {
    return <div>There was an error loading your table</div>;
  }

  return (
    <WorkspaceLayout>
      <div>
        <h1>Table {id}</h1>
        {/* Your table-related content goes here */}
      </div>
    </WorkspaceLayout>
  );
}
