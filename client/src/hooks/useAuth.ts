import { useState } from 'react';
import axios from 'axios';

import useUser from './useUser';
import { TAuth } from '../utils/types';

type TUseAuth = {
  login(data: TAuth): Promise<void>;
  signUp(data: TAuth): Promise<void>;
  signOut(): void;
  message: string;
};

const useAuth = (): TUseAuth => {
  const [message, setMessage] = useState('');
  const { updateUser, clearUser } = useUser();

  const authMethod = async (authData: TAuth, url: string): Promise<void> => {
    try {
      const { data, status } = await axios.post(url, authData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (status === 400) {
        setMessage('Auth failed');
        return;
      }
      if ('user' in data && 'token' in data.user) {
        updateUser(data.user);
      }
      setMessage('Auth successful');
    } catch (error) {
      error instanceof Error
        ? setMessage(error.message)
        : setMessage('Auth failed');
    }
  };

  async function signUp(authData: TAuth): Promise<void> {
    await authMethod(authData, '/api/auth/sign-up');
  }
  async function login(authData: TAuth): Promise<void> {
    await authMethod(authData, '/api/auth/login');
  }

  function signOut() {
    clearUser();
  }

  return { message, signUp, signOut, login };
};

export default useAuth;
