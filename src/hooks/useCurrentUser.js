import { useQuery } from '@tanstack/react-query';
import { useUser, useAuth } from '@clerk/nextjs';
import supabase from '../utils/supabaseClient';

export const useCurrentUser = () => {
  const { getToken } = useAuth();
  const { user } = useUser();

  const fetchUser = async () => {
    if (user?.id) {
      const token = await getToken({ template: 'supabase-dev' });
      const { data, error } = await supabase.from('users').select().eq('clerkUserId', user.id);
      const result = data?.[0];
      console.log('awu result', result);
      return result;
    } else {
      return null;
    }
  };

  return useQuery(['currentUser'], fetchUser, { enabled: user.id !== null });
};
