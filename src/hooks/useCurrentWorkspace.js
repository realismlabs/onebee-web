import { useQuery } from '@tanstack/react-query';
import { fetchCurrentWorkspace } from '../utils/api';

export const useCurrentWorkspace = () => {
  return useQuery(['currentWorkspace'], fetchCurrentWorkspace);
};
