import { useForm, SubmitHandler } from 'react-hook-form';
//import Spinner from '../Shared/Spinner';
import { INewTask } from '../../utils/types';
import useMutateTasks from '../../hooks/useMutateTask';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {
  const { isLoading, mutate } = useMutateTasks();
  const { register, handleSubmit } = useForm<INewTask>();

  const onSubmit: SubmitHandler<INewTask> = (data) => {
    mutate(data);
  };

  return (
    <>
      <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={classes.control}>
          <label htmlFor='task-name'>Title</label>
          <input type='text' id='task-name' required {...register('title')} />
        </div>
        <div className={classes.control}>
          <label htmlFor='task-description'>Description</label>
          <input
            type='text'
            id='task-description'
            required
            {...register('description')}
          />
        </div>
        <div className={classes.control}>
          <label htmlFor='task-image'>Image</label>
          <input type='text' id='task-image' required {...register('image')} />
        </div>
        {/* <div className={classes.control}>
          image shall go here
          <label htmlFor='image'>Task Image</label>
          <input type='file' id='image' required />
        </div> */}
        <div className={classes.action}>
          <button disabled={isLoading}>Add Task</button>
        </div>
      </form>
    </>
  );
};

export default ProfileForm;
