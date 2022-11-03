import axios, { AxiosResponse } from 'axios';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { queryKeys, TUser, TUserData } from '../utils/types';
import {
  clearLocalStorage,
  fetchFromLocalStorage,
  setToLocalStorage,
} from '../utils/localStorage';

type TUseUser = {
  updateUser: (user: TUser | null) => void;
  clearUser: () => void;
  userInfo: TUserData | null | undefined;
};

async function fetchCurrentUser(
  user: TUserData | null,
  signal: AbortSignal | undefined
): Promise<TUserData | null> {
  if (!user) return null;
  const userData = fetchFromLocalStorage();
  if (!userData) return null;
  const { data }: AxiosResponse<TUserData> = await axios.get(
    `/api/auth/user/${user.id}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userData.token}`,
      },
      signal,
    }
  );
  return data;
}

const useUser = (): TUseUser => {
  const queryClient = useQueryClient();
  const userData = fetchFromLocalStorage();
  const { data } = useQuery(
    [queryKeys.USER],
    ({ signal }) => fetchCurrentUser(userData, signal),
    {
      onSuccess(dt: TUserData | null) {
        if (!dt) {
          clearLocalStorage();
        } else {
          setToLocalStorage(dt);
        }
      },
      initialData: fetchFromLocalStorage,
    }
  );

  const updateUser = (userData: TUser | null): void => {
    queryClient.setQueryData([queryKeys.USER], userData);
  };
  const clearUser = (): void => {
    queryClient.setQueryData([queryKeys.USER], null);
    clearLocalStorage();
  };

  return { userInfo: data, updateUser, clearUser };
};

export default useUser;
