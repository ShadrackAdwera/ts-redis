import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardActions, Chip } from '@mui/material';

interface ITasks {
  title: string;
  description: string;
  createdAt: string;
  status: string;
  image: string;
}

export default function TasksCard({
  title,
  description,
  createdAt,
  status,
  image,
}: ITasks) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia component='img' height='140' image={image} alt='pann' />
        <CardContent>
          <Typography gutterBottom variant='h5' component='div'>
            {title}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Chip label={status} color='primary' variant='outlined' />
        <Chip label={createdAt} color='primary' variant='outlined' />
      </CardActions>
    </Card>
  );
}
