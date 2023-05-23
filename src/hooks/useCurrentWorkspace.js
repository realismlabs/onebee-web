import { useQuery } from '@tanstack/react-query';
import { fetchCurrentWorkspace } from '../utils/api';
import { useRouter } from 'next/router';
import { useAuth } from '@clerk/nextjs';

export const useCurrentWorkspace = () => {
  const { getToken } = useAuth();
  const router = useRouter();
  const workspaceId = parseInt(router.query.workspaceId);
  const data = useQuery(['currentWorkspace', workspaceId], async () => fetchCurrentWorkspace(workspaceId, { Authorization: `Bearer ${await getToken({ template: 'test' })}` }), {
    enabled: !!workspaceId, // Only run the query if workspaceId is available
  });
  return data;
};
