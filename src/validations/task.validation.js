const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createTask = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().allow(''), // Optional
    status: Joi.string().required().valid('To Do', 'In Progress', 'Done'),
    dueDate: Joi.date().optional(),
    priority: Joi.string().valid('Low', 'Medium', 'High').default('Medium'),
  }),
};

const getTasks = {
  query: Joi.object().keys({
    column: Joi.string().valid('To Do', 'In Progress', 'Done'),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getTask = {
  params: Joi.object().keys({
    taskId: Joi.string().custom(objectId),
  }),
};

const updateTask = {
  params: Joi.object().keys({
    taskId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string(),
      description: Joi.string().allow(''),
      status: Joi.string().valid('To Do', 'In Progress', 'Done'),
      dueDate: Joi.date(),
      priority: Joi.string().valid('Low', 'Medium', 'High'),
    })
    .min(1), // Ensure at least one field is provided
};

const deleteTask = {
  params: Joi.object().keys({
    taskId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
};