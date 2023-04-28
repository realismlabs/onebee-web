import React from 'react';
import Link from 'next/link';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useCurrentWorkspace } from '../hooks/useCurrentWorkspace';
import { useQuery } from '@tanstack/react-query';
import { getTables } from '../utils/api';

const WorkspaceShell = () => {
  // Replace the items array with your dynamic data

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
    data: tablesData,
    isLoading: areTablesLoading,
    error: tablesError,
  } = useQuery({
    queryKey: ["tables-workspace", currentWorkspace.id],
    queryFn: async () => {
      return await getTables(currentWorkspace.id)
    },
    enabled: currentWorkspace?.id !== null
  });

  if (areTablesLoading) {
    return <div>Loading...</div>;
  }

  if (tablesError) {
    return <div>There was an error loading your tables</div>;
  }

  return (
    <div className="bg-slate-1 p-4">
      <h2 className="text-white mb-4">Tables</h2>
      <ul>
        {tablesData.map((item) => (
          <li key={item.id} className="mb-2">
            <Link href={`/table/${item.id}`}>
              <div className="text-white hover:text-blue-600">{item.name}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkspaceShell;
