import request from 'supertest';

import { app } from '../../app';
import { Task } from '../../models/Tasks';
import { generateTaskId } from '../../utils/generateTaskId';

const tasksRoute = '/api/tasks';
const newTask = {
  title: 'Task 001',
  description: 'Description 001',
  image: 'https://www.google.com',
};

const ticketId = generateTaskId();

describe('tasks controllers', () => {
  describe('create task controller', () => {
    it('returns a 401 when creating a task without being authenticated', async () => {
      return request(app).post(`${tasksRoute}/new`).send(newTask).expect(401);
    });
    it('listens to requests made on /api/tasks', async () => {
      const response = await request(app)
        .post(`${tasksRoute}/new`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${global.login()}`)
        .send(newTask);

      expect(response.status).not.toEqual(404);
    });
    it('returns a 422 when a title is not provided when creating a task', () => {
      return request(app)
        .post(`${tasksRoute}/new`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${global.login()}`)
        .send({ description: 'Some sort of description without a title' })
        .expect(422);
    });
    it('returns a 422 when a description is not provided when creating a task', () => {
      return request(app)
        .post(`${tasksRoute}/new`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${global.login()}`)
        .send({ title: 'Some sort of title without description' })
        .expect(422);
    });
    it('returns a 201 when a task has been added sucessfully', async () => {
      return request(app)
        .post(`${tasksRoute}/new`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${global.login()}`)
        .send(newTask)
        .expect(201);
    });
    it('should save the task to the DB', async () => {
      let tasks = await Task.find({});
      expect(tasks.length).toEqual(0);
      const response = await request(app)
        .post(`${tasksRoute}/new`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${global.login()}`)
        .send(newTask);
      expect(response.status).toEqual(201);
      tasks = await Task.find({});
      expect(tasks.length).toEqual(1);
      expect(tasks[0].title).toEqual(newTask.title);
    });
  });
  describe('get all tasks controller', () => {
    it('returns a 401 when fetching tasks without being authenticated', async () => {
      return request(app).get(tasksRoute).expect(401);
    });
    it('returns all tasks with a 200 status code', () => {
      return request(app)
        .get(tasksRoute)
        .set('Authorization', `Bearer ${global.login()}`)
        .expect(200);
    });
  });
  describe('get all pending tasks controller', () => {
    it('returns a 401 when fetching pending tasks without being authenticated', () => {
      return request(app).get(`${tasksRoute}/pending-tasks/all`).expect(401);
    });
    it('returns all pending tasks with a 200 status code', () => {
      return request(app)
        .get(`${tasksRoute}/pending-tasks/all`)
        .set('Authorization', `Bearer ${global.login()}`)
        .expect(200);
    });
  });
  describe('get task by id controller', () => {
    it('should return a 401 when fetching a task without authentication', async () => {
      return request(app).get(`${tasksRoute}/${ticketId}`).expect(401);
    });
    it('should return a 404 when a task is not found', async () => {
      return request(app)
        .get(`${tasksRoute}/${ticketId}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${global.login()}`)
        .expect(404);
    });
    it('should return a 200 when the task by ID is found', async () => {
      const response = await request(app)
        .post(`${tasksRoute}/new`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${global.login()}`)
        .send(newTask)
        .expect(201);
      const taskCreated = await request(app)
        .get(`${tasksRoute}/${response.body.id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${global.login()}`)
        .expect(200);
      expect(taskCreated.body.title).toEqual(newTask.title);
      expect(taskCreated.body.description).toEqual(newTask.description);
      expect(taskCreated.body.image).toEqual(newTask.image);
    });
  });
  describe('update task status controller', () => {
    it.todo(
      'returns a 401 when updating task status without being authenticated'
    );
    it.todo('returns a 404 when task with the give Id is not found');
    it.todo('returns a 200 when a task status has been updated sucessfully');
  });
});
