import { useQuery } from '@tanstack/react-query';
import { fetchCurrentWorkspace } from '../utils/api';

export const useCurrentWorkspace = () => {
  console.log("useCurrentWorkspace")
  const data = useQuery(['currentWorkspace'], fetchCurrentWorkspace);
  return data;
};
