import { useQuery } from '@tanstack/react-query';
import { fetchCurrentWorkspace } from '../utils/workspace';

export const useCurrentWorkspace = () => {
  return useQuery(['currentWorkspace'], fetchCurrentWorkspace);
};
