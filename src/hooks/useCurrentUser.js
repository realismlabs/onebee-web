import { useQuery } from '@tanstack/react-query';
import { fetchCurrentUser } from '../utils/api';

export const useCurrentUser = () => {
  return useQuery(['currentUser'], fetchCurrentUser);
};
