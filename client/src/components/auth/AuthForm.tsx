import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

import { TAuth } from '../../utils/types';
import classes from './AuthForm.module.css';
//import Spinner from '../Shared/Spinner';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { register, handleSubmit } = useForm<TAuth>();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const onSubmit: SubmitHandler<TAuth> = (data) => {
    if (isLogin) {
      console.log(data);
    } else {
      //username must be provided - call signUp here
      console.log(data);
    }
  };

  // const submitHandler = (e: FormEvent) => {
  //   e.preventDefault();
  // };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {!isLogin && (
          <div className={classes.control}>
            <label htmlFor='name'>Username</label>
            <input id='username' {...register('username')} />
          </div>
        )}
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required {...register('email')} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input
            type='password'
            id='password'
            required
            {...register('password')}
          />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
