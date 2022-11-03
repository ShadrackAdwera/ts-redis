import { useState, ReactNode } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

import useUser from '../hooks/useUser';

interface IProtectedRoutes {
  children: ReactNode;
}

const UnauthenticatedPage = () => {
  const navigate = useNavigate();
  return (
    <div style={{ padding: 16 }}>
      <p>You are not logged in.</p>
      <Button
        variant='text'
        onClick={() => navigate('/login', { replace: true })}
      >
        Go to login
      </Button>
    </div>
  );
};

const AuthGuard = (props: IProtectedRoutes) => {
  const { children } = props;
  const { userInfo } = useUser();
  const { pathname } = useLocation();
  // eslint-disable-next-line max-len
  const [requestedLocation, setRequestedLocation] = useState<string | null>(
    null
  );
  if (!userInfo) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <UnauthenticatedPage />;
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
};

export default AuthGuard;
