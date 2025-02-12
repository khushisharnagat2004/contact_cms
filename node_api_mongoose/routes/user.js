const express = require('express');
const { check } = require('express-validator');
const { registerUser, loginUser,logoutUser } = require('../controller/userController');

const router = express.Router();

// Register route
router.post('/register', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
], registerUser);

// Login route
router.post('/login', [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password is required').exists()
], loginUser);

router.post('/logout',logoutUser);

module.exports = router;
