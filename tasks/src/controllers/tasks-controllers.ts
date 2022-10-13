import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { HttpError } from '@adwesh/common';

import { Task, taskStatus } from '../models/Tasks';
import { initRedis } from '../init-redis';

const createTask = async (req: Request, res: Response, next: NextFunction) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError('Invalid inputs', 422));
  }
  const userId = <string>req.user?.userId;
  const { title, description, image } = req.body;

  const newTask = new Task({
    title,
    description,
    image,
    createdBy: userId,
    status: taskStatus.pending,
  });

  try {
    await newTask.save();
  } catch (error) {
    return next(new HttpError('An error occured, try again', 500));
  }

  res.status(201).json({ message: 'New task created', task: newTask });
};

const getAllTasks = async (req: Request, res: Response, next: NextFunction) => {
  let foundTasks;
  let cachedTasks;
  let userId = <string>req.user?.userId;

  // check if the cached data exists related to query
  try {
    cachedTasks = await initRedis.client.get(userId);
  } catch (error) {
    return next(
      new HttpError(
        error instanceof Error ? error.message : 'An error occured',
        500
      )
    );
  }
  // if yes respond to request then return
  if (cachedTasks) {
    console.log('Serving data from CACHE . . . ');
    const tasks = JSON.parse(cachedTasks);
    return res.status(200).json({ totalTasks: tasks.length, tasks });
  }

  try {
    foundTasks = await Task.find({ createdBy: userId }).exec();
  } catch (error) {
    return next(
      new HttpError(
        error instanceof Error ? error.message : 'An error occured',
        500
      )
    );
  }
  // if no, respond to request then update cache to store the data
  try {
    await initRedis.client.set(userId, JSON.stringify(foundTasks));
  } catch (error) {
    return next(
      new HttpError(
        error instanceof Error ? error.message : 'An error occured',
        500
      )
    );
  }
  res.status(200).json({ totalTasks: foundTasks.length, tasks: foundTasks });
};

const getPendingTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let foundTasks;
  let userId = <string>req.user?.userId;
  try {
    foundTasks = await Task.find({
      createdBy: userId,
      status: taskStatus.pending,
    }).exec();
  } catch (error) {
    return next(new HttpError('An error occured, try again', 500));
  }

  res.status(200).json({ totalTasks: foundTasks.length, tasks: foundTasks });
};

const updateTasksAssigned = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const taskId = req.params.taskId;
  const userId = <string>req.user?.userId;
  const { taskStatus } = req.body;
  let foundTask;

  try {
    foundTask = await Task.findById(taskId).exec();
  } catch (error) {
    return next(new HttpError('An error occured, try again', 500));
  }
  if (!foundTask) {
    return next(new HttpError('This task does not exist!', 404));
  }

  foundTask.status = taskStatus;
  try {
    await foundTask.save();
    //publish to scheduler
  } catch (error) {
    return next(new HttpError('An error occured, try again', 500));
  }
};

export { getAllTasks, getPendingTasks, createTask, updateTasksAssigned };
