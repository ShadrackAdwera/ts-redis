import { checkAuth } from '@adwesh/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import express from 'express';

import {
  createTask,
  getAllTasks,
  getPendingTasks,
  getTaskById,
  updateTasksAssigned,
} from '../controllers/tasks-controllers';
//import { clearCache } from '../utils/clearCache';

const router = express.Router();

router.use(checkAuth);

router.get('/', getAllTasks);
router.get('/pending-tasks/all', getPendingTasks);
// cache implementation
// router.post(
//   '/new',
//   [
//     body('title').trim().not().isEmpty(),
//     body('description').trim().not().isEmpty(),
//   ],
//   clearCache,
//   createTask
// );
router.get('/:taskId', getTaskById);
router.post(
  '/new',
  [
    body('title').trim().not().isEmpty(),
    body('description').trim().not().isEmpty(),
  ],
  createTask
);
router.patch('/:taskId', updateTasksAssigned);

export { router as tasksRouter };
