import { useQueryClient } from '@tanstack/react-query';
import { queryKeys, TUser } from '../utils/types';

type TUseUser = {
  updateUser: (user: TUser | null) => void;
  clearUser: () => void;
};

const useUser = (): TUseUser => {
  const queryClient = useQueryClient();
  const updateUser = (userData: TUser | null): void => {
    queryClient.setQueryData([queryKeys.USER], userData);
  };
  const clearUser = (): void => {
    queryClient.setQueryData([queryKeys.USER], null);
  };

  return { updateUser, clearUser };
};

export default useUser;
