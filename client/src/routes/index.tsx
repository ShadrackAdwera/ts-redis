import * as React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import UserProfile from '../components/profile/UserProfile';
import AuthGuard from '../guards/AuthGuard';
import AuthPage from '../pages/AuthPage';
import HomePage from '../pages/HomePage';

export const Router = () => {
  return useRoutes([
    {
      path: '/',
      children: [
        {
          path: '',
          element: (
            <Layout>
              <AuthGuard>
                <HomePage />
              </AuthGuard>
            </Layout>
          ),
        },
        {
          path: 'profile',
          element: (
            <Layout>
              <AuthGuard>
                <UserProfile />
              </AuthGuard>
            </Layout>
          ),
        },
        {
          path: 'auth',
          element: (
            <Layout>
              <AuthPage />
            </Layout>
          ),
        },
        { path: '*', element: <Navigate to='/auth' /> },
      ],
    },
  ]);
};
