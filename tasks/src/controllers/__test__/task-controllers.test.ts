describe('tasks controllers', () => {
  describe('create task controller', () => {
    it('returns a 401 when creating a task without being authenticated', () => {});
    it('listens to requests made on /api/tasks', () => {});
    it('returns a 422 when a title is not provided when creating a task', () => {});
    it('returns a 422 when a description is not provided when creating a task', () => {});
    it('returns a 201 when a task has been added sucessfully', () => {});
  });
  describe('get all tasks controller', () => {
    it('returns a 401 when fetching tasks without being authenticated', () => {});
    it('returns all tasks with a 200 status code', () => {});
  });
  describe('get all pending tasks controller', () => {
    it('returns a 401 when fetching pending tasks without being authenticated', () => {});
    it('returns all pending tasks with a 200 status code', () => {});
  });
  describe('update task status controller', () => {
    it('returns a 401 when updating task status without being authenticated', () => {});
    it('returns a 404 when task with the give Id is not found', () => {});
    it('returns a 200 when a task status has been updated sucessfully', () => {});
  });
});
