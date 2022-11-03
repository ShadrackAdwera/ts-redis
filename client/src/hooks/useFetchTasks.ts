import axios, { AxiosResponse } from 'axios';
import { useQuery } from '@tanstack/react-query';
import { queryKeys, TTasks } from '../utils/types';
import useUser from './useUser';

const fetchTasks = async (
  token: string | undefined,
  signal: AbortSignal | undefined
): Promise<TTasks[]> => {
  const { data }: AxiosResponse<TTasks[]> = await axios.get('/api/tasks', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  return data;
};

const useFetchTasks = () => {
  const { userInfo } = useUser();
  const { data = [] } = useQuery(
    [queryKeys.TASKS],
    ({ signal }) => fetchTasks(userInfo?.token, signal),
    {
      enabled: !!userInfo,
    }
  );
  return { tasks: data };
};

export default useFetchTasks;
