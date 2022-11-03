import { useState } from 'react';
import {
  useMutation,
  UseMutateFunction,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';

import { queryKeys, TMutateProps, INewTask } from '../utils/types';
import useUser from './useUser';

type TUseMutationProps = {
  mutate: UseMutateFunction<unknown, unknown, INewTask, unknown>;
};

type TUseMutateTasks = TMutateProps & TUseMutationProps;

const handleAddTask = async (
  taskData: INewTask,
  token: string | undefined
): Promise<void> => {
  await axios.post(`/api/tasks/new`, taskData, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};

const useMutateTasks = (): TUseMutateTasks => {
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const queryClient = useQueryClient();
  const { userInfo } = useUser();

  const dismissDrawer = () => setIsOpenDrawer(false);
  const openDrawer = () => setIsOpenDrawer(true);

  // check for permissions on the component
  const { isLoading, mutate } = useMutation(
    [queryKeys.TASKS],
    (data: INewTask) => handleAddTask(data, userInfo?.token),
    {
      onSuccess() {
        // to add snackbars that autodisappear to alert users? Maybe . . .
        setIsOpenDrawer(false);
        queryClient.invalidateQueries([queryKeys.TASKS]);
      },
      onError(error) {
        error instanceof Error
          ? alert(error.message)
          : alert('An error occured');
      },
    }
  );

  return { isLoading, isOpenDrawer, mutate, dismissDrawer, openDrawer };
};

export default useMutateTasks;
