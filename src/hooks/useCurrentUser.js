import { useQuery } from '@tanstack/react-query';
import { fetchCurrentUser } from '../utils/api';
import { useUser } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs';

export const useCurrentUser = () => {
  const { getToken } = useAuth();
  const { user } = useUser();

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const result = await fetchCurrentUser(user?.id, { Authorization: `Bearer ${await getToken({ template: 'test' })}` })
      return result
    },
    enabled: user?.id !== null,
  });
};
