import { useQuery } from '@tanstack/react-query';
import { fetchCurrentWorkspace } from '../utils/api';
import { useRouter } from 'next/router';

export const useCurrentWorkspace = () => {
  console.log("useCurrentWorkspace");

  const router = useRouter();
  const workspaceId = router.query.workspaceId;

  // Check if the workspaceId is available before fetching data
  const data = useQuery(['currentWorkspace', workspaceId], () => fetchCurrentWorkspace(workspaceId), {
    enabled: !!workspaceId, // Only run the query if workspaceId is available
  });

  console.log("useCurrentWorkspace", data.data);
  return data;
};
