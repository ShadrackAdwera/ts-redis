import { Link } from 'react-router-dom';
import useUser from '../../hooks/useUser';

import classes from './MainNavigation.module.css';

const MainNavigation = () => {
  const { userInfo } = useUser();
  return (
    <header className={classes.header}>
      {userInfo && (
        <Link to='/'>
          <div className={classes.logo}>React Query</div>
        </Link>
      )}
      <nav>
        <ul>
          <li>
            <Link to='/auth'>Login</Link>
          </li>
          {userInfo && (
            <li>
              <Link to='/profile'>Profile</Link>
            </li>
          )}
          {userInfo && (
            <li>
              <button onClick={() => {}}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
