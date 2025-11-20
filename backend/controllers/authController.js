const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE || '7d'
        }
    );
};

const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        db.get(
            'SELECT * FROM users WHERE email = ? OR username = ?',
            [email, username],
            async (err, existingUser) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'Database error',
                        error: err.message
                    });
                }

                if (existingUser) {
                    return res.status(400).json({
                        success: false,
                        message: 'User with this email or username already exists'
                    });
                }

                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                const userRole = role || 'user';

                db.run(
                    'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
                    [username, email, hashedPassword, userRole],
                    function(err) {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: 'Error creating user',
                                error: err.message
                            });
                        }

                        const userId = this.lastID;
                        const token = generateToken({
                            id: userId,
                            username,
                            role: userRole
                        });

                        res.status(201).json({
                            success: true,
                            message: 'User registered successfully',
                            token,
                            user: {
                                id: userId,
                                username,
                                email,
                                role: userRole
                            }
                        });
                    }
                );
            }
        );
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        db.get(
            'SELECT * FROM users WHERE email = ?',
            [email],
            async (err, user) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'Database error',
                        error: err.message
                    });
                }

                if (!user) {
                    return res.status(401).json({
                        success: false,
                        message: 'Invalid credentials'
                    });
                }

                const isMatch = await bcrypt.compare(password, user.password);

                if (!isMatch) {
                    return res.status(401).json({
                        success: false,
                        message: 'Invalid credentials'
                    });
                }

                const token = generateToken(user);

                res.json({
                    success: true,
                    message: 'Login successful',
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    }
                });
            }
        );
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

const getMe = (req, res) => {
    db.get(
        'SELECT id, username, email, role, createdAt FROM users WHERE id = ?',
        [req.user.id],
        (err, user) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Database error',
                    error: err.message
                });
            }

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.json({
                success: true,
                user
            });
        }
    );
};

module.exports = {
    register,
    login,
    getMe
};