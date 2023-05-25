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
      const result = await fetchCurrentUser(user?.id, {
        Authorization: `Bearer ${await getToken({ template: 'test' })}`,
      })
      // const result = await fetch(`https://dataland-demo-995df.uc.r.appspot.com/users`, { headers: { Authorization: `Bearer ${await getToken({ template: 'test' })}`, credentials: 'include', } })
      // const response = await result.json()
      // console.log("awu test gapp", response)
      return result
    },
    enabled: !!user?.id,
  });
};
