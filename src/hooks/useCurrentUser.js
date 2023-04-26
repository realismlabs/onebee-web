import { useQuery } from '@tanstack/react-query';
import { fetchCurrentUser } from '../utils/user';

export const useCurrentUser = () => {
  return useQuery(['currentUser'], fetchCurrentUser);
};
