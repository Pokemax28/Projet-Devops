const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const db = require('../db');
const { authenticate, verifyRole } = require('../auth/auth');

const authController = require('../auth/auth'); 

// Routes
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/verify', authenticate, verifyRole);


// // GET /api/auth/verify?role=<role>
// router.get('/verify', authenticate, (req, res) => {
//     const requiredRole = req.query.role;
//     if (req.user.role !== requiredRole) {
//       return res.status(403).end();   // Forbidden
//     }
//     res.status(200).end();           // OK
//   });


module.exports = router;