import { Grid } from '@mui/material';

import useFetchTasks from '../../hooks/useFetchTasks';
import TasksCard from '../Card/Card';
import classes from './StartingPageContent.module.css';

const StartingPageContent = () => {
  const { tasks } = useFetchTasks();
  return (
    <section className={classes.starting}>
      <h3>React Query Rocks!</h3>
      <Grid container spacing={3}>
        {tasks.map((task) => (
          <Grid key={task.id} item xs={12} sm={12} md={6} lg={6}>
            <TasksCard
              createdAt={new Date().toDateString()}
              description={task.description}
              title={task.title}
              status={task.status}
              image={task.image}
            />
          </Grid>
        ))}
      </Grid>
    </section>
  );
};

export default StartingPageContent;
