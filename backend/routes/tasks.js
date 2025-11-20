const express = require('express');
const router = express.Router();
const {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { validate, taskSchema } = require('../middleware/admin');

router.route('/')
    .get(protect, getTasks)
    .post(protect, validate(taskSchema), createTask);

router.route('/:id')
    .get(protect, getTask)
    .put(protect, updateTask)
    .delete(protect, deleteTask);

module.exports = router;