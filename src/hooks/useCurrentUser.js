import { useQuery } from '@tanstack/react-query';
import { fetchCurrentUser } from '../utils/api';
import { useUser } from '@clerk/nextjs';

export const useCurrentUser = () => {

  const user = useUser();

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const result = await fetchCurrentUser(user?.user?.id)
      console.log('awu result', result)
      return result
    },
    enabled: user.id !== null,
  });
};
