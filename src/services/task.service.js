const httpStatus = require('http-status');
const { Task } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a task
 * @param {Object} taskBody
 * @param {ObjectId} userId - ID of the user creating the task
 * @returns {Promise<Task>}
 */
const createTask = async (taskBody, userId) => {
  taskBody.createdBy = userId;
  return Task.create(taskBody);
};

/**
 * Query for tasks
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @param {number} [options.select] - Current page (default = )
 * @returns {Promise<QueryResult>}
 */
const queryTasks = async (filter, options) => {
  console.log(options)
  options.select = 'title description status dueDate priority createdAt'; // Specify fields

  const tasks = await Task.paginate(filter, options);
  return tasks;
};

/**
 * Get task by id
 * @param {ObjectId} id
 * @returns {Promise<Task>}
 */
const getTaskById = async (id) => {
  const task = await Task.findById(id)
    .populate('createdBy', 'name email') // Include specific fields from the `createdBy` reference
    .select('title description status dueDate priority createdAt'); // Select fields to return, including createdAt
  
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  
  return task;
};

/**
 * Update task by id
 * @param {ObjectId} taskId
 * @param {Object} updateBody
 * @returns {Promise<Task>}
 */
const updateTaskById = async (taskId, updateBody) => {
  const task = await getTaskById(taskId);
  console.log(updateBody)
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  Object.assign(task, updateBody);
  await task.save();
  return task;
};

/**
 * Delete task by id
 * @param {ObjectId} taskId
 * @returns {Promise<Task>}
 */
const deleteTaskById = async (taskId) => {
  const task = await getTaskById(taskId);
  if (!task) {
    throw new ApiError(404, 'Task not found');
  }
  await Task.deleteOne({ _id: taskId });
  return task;
};

module.exports = {
  createTask,
  queryTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
};