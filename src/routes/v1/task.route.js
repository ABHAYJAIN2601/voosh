const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const taskValidation = require('../../validations/task.validation');
const taskController = require('../../controllers/task.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageTasks'), validate(taskValidation.createTask), taskController.createTask)
  .get(auth('getTasks'), validate(taskValidation.getTasks), taskController.getTasks);

router
  .route('/:taskId')
  .get(auth('getTasks'), validate(taskValidation.getTask), taskController.getTask)
  .patch(auth('manageTasks'), taskController.updateTask)
  .delete(auth('manageTasks'), validate(taskValidation.deleteTask), taskController.deleteTask);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management and retrieval
 */

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a task
 *     description: Only authorized users can create tasks.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - column
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               column:
 *                 type: string
 *                 enum: [To Do, In Progress, Done]
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *             example:
 *               title: Create Task API
 *               description: Implement API for managing tasks
 *               column: To Do
 *               dueDate: 2023-11-20T00:00:00.000Z
 *               priority: High
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Task'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *
 *   get:
 *     summary: Get all tasks
 *     description: Authorized users can retrieve all tasks.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: column
 *         schema:
 *           type: string
 *         description: Filter tasks by column
 *       - in: query
 *         name: assignedTo
 *         schema:
 *           type: string
 *         description: Filter tasks by assigned user ID
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. title:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of tasks
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 */

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task
 *     description: Authorized users can fetch specific task details by ID.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Task'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a task
 *     description: Only authorized users can update task details.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               column:
 *                 type: string
 *                 enum: [To Do, In Progress, Done]
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *             example:
 *               title: Updated Task Title
 *               column: In Progress
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Task'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a task
 *     description: Only authorized users can delete tasks.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       "204":
 *         description: No content
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */