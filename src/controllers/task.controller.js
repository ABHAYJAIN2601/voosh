const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { taskService } = require('../services');

const createTask = catchAsync(async (req, res) => {
  const task = await taskService.createTask(req.body, req.user.id); // req.user.id for the authenticated user
  res.status(200).send(task);
});

const getTasks = catchAsync(async (req, res) => {
 // Ensure user-related tasks only
 const userFilter = { createdBy: req.user.id }; // Replace 'createdBy' with the field name in your schema

 // Extract other filters from query parameters
 const filter = { ...userFilter, ...pick(req.query, ['priority', 'createdAt']) };

 // Extract pagination and sorting options
 const options = pick(req.query, ['sortBy', 'limit', 'page']);

 // Fetch tasks using the service
 const result = await taskService.queryTasks(filter, options);

 // Send filtered tasks as the response
 res.send(result);
});

const getTask = catchAsync(async (req, res) => {
  const task = await taskService.getTaskById(req.params.taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  res.send(task);
});

const updateTask = catchAsync(async (req, res) => {
  const task = await taskService.updateTaskById(req.params.taskId, req.body);
  res.send(task);
});

const deleteTask = catchAsync(async (req, res) => {
  await taskService.deleteTaskById(req.params.taskId);
  res.status(204).send();
});

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
};