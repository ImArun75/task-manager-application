const db = require('../models');

const getTasks = (req, res) => {
    let query;
    let params;

    if (req.user.role === 'admin') {
        query = `
            SELECT tasks.*, users.username as creatorName
            FROM tasks
            LEFT JOIN users ON tasks.createdBy = users.id
            ORDER BY tasks.createdAt DESC
        `;
        params = [];
    } else {
        query = `
            SELECT tasks.*, users.username as creatorName
            FROM tasks
            LEFT JOIN users ON tasks.createdBy = users.id
            WHERE tasks.createdBy = ?
            ORDER BY tasks.createdAt DESC
        `;
        params = [req.user.id];
    }

    db.all(query, params, (err, tasks) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error fetching tasks',
                error: err.message
            });
        }
        res.json({
            success: true,
            count: tasks.length,
            tasks
        });
    });
};

const getTask = (req, res) => {
    const taskId = req.params.id;
    db.get(
        `SELECT tasks.*, users.username as creatorName
        FROM tasks
        LEFT JOIN users ON tasks.createdBy = users.id
        WHERE tasks.id = ?`,
        [taskId],
        (err, task) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error fetching task',
                    error: err.message
                });
            }
            if (!task) {
                return res.status(404).json({
                    success: false,
                    message: 'Task not found'
                });
            }

            if (req.user.role !== 'admin' && task.createdBy !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to access this task'
                });
            }

            res.json({
                success: true,
                task
            });
        }
    );
};

const createTask = (req, res) => {
    const { title, description, status, priority } = req.body;
    const createdBy = req.user.id;

    db.run(
        `INSERT INTO tasks (title, description, status, priority, createdBy)
        VALUES (?, ?, ?, ?, ?)`,
        [title, description || '', status || 'pending', priority || 'medium', createdBy],
        function(err) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error creating task',
                    error: err.message
                });
            }

            db.get(
                `SELECT tasks.*, users.username as creatorName
                FROM tasks
                LEFT JOIN users ON tasks.createdBy = users.id
                WHERE tasks.id = ?`,
                [this.lastID],
                (err, task) => {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: 'Task created but error fetching details',
                            error: err.message
                        });
                    }
                    res.status(201).json({
                        success: true,
                        message: 'Task created successfully',
                        task
                    });
                }
            );
        }
    );
};

const updateTask = (req, res) => {
    const taskId = req.params.id;
    const { title, description, status, priority } = req.body;

    db.get(
        'SELECT * FROM tasks WHERE id = ?',
        [taskId],
        (err, task) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Database error',
                    error: err.message
                });
            }
            if (!task) {
                return res.status(404).json({
                    success: false,
                    message: 'Task not found'
                });
            }

            if (req.user.role !== 'admin' && task.createdBy !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to update this task'
                });
            }

            db.run(
                `UPDATE tasks
                SET title = ?, description = ?, status = ?, priority = ?, updatedAt = CURRENT_TIMESTAMP
                WHERE id = ?`,
                [
                    title || task.title,
                    description !== undefined ? description : task.description,
                    status || task.status,
                    priority || task.priority,
                    taskId
                ],
                function(err) {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: 'Error updating task',
                            error: err.message
                        });
                    }

                    db.get(
                        `SELECT tasks.*, users.username as creatorName
                        FROM tasks
                        LEFT JOIN users ON tasks.createdBy = users.id
                        WHERE tasks.id = ?`,
                        [taskId],
                        (err, updatedTask) => {
                            if (err) {
                                return res.status(500).json({
                                    success: false,
                                    message: 'Task updated but error fetching details',
                                    error: err.message
                                });
                            }
                            res.json({
                                success: true,
                                message: 'Task updated successfully',
                                task: updatedTask
                            });
                        }
                    );
                }
            );
        }
    );
};

const deleteTask = (req, res) => {
    const taskId = req.params.id;

    db.get(
        'SELECT * FROM tasks WHERE id = ?',
        [taskId],
        (err, task) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Database error',
                    error: err.message
                });
            }
            if (!task) {
                return res.status(404).json({
                    success: false,
                    message: 'Task not found'
                });
            }

            if (req.user.role !== 'admin' && task.createdBy !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to delete this task'
                });
            }

            db.run(
                'DELETE FROM tasks WHERE id = ?',
                [taskId],
                function(err) {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: 'Error deleting task',
                            error: err.message
                        });
                    }
                    res.json({
                        success: true,
                        message: 'Task deleted successfully'
                    });
                }
            );
        }
    );
};

module.exports = {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask
};