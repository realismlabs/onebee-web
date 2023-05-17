import { useQuery } from '@tanstack/react-query';
import { fetchCurrentWorkspace } from '../utils/api';
import { useRouter } from 'next/router';

export const useCurrentWorkspace = () => {
  const router = useRouter();
  const workspaceId = parseInt(router.query.workspaceId);
  const data = useQuery(['currentWorkspace', workspaceId], () => fetchCurrentWorkspace(workspaceId), {
    enabled: !!workspaceId, // Only run the query if workspaceId is available
  });
  return data;
};
