const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const db = require('../db');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    const role = 'Employé'; // default role
    const register_date = new Date().toISOString();

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        db.run(
            `INSERT INTO users (nom, email, mot_de_passe, role, date_inscription)
             VALUES (?, ?, ?, ?, ?)`,
            [username, email, hashedPassword, role, register_date],
            function (err) {
                if (err) {
                    console.error(err.message);
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ error: 'Username or email already exists' });
                    } else {
                        return res.status(500).json({ error: 'Database error' });
                    }
                }
                return res.status(201).json({ message: 'User registered successfully' });
            }
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};

exports.loginUser = (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
  
    db.get('SELECT * FROM users WHERE nom = ?', [username], async (err, user) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
        
      console.log(user,password, user.mot_de_passe); // Debugging line
      const match = await bcrypt.compare(password, user.mot_de_passe);
      if (!match) return res.status(401).json({ error: 'Invalid credentials' });
  
      // Create a JWT with id and role
      const payload = { id: user.id, role: user.role };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
      console.log('JWT_SECRET:', JWT_SECRET); // Debugging line
  
      res.json({ token });
    });
  };

  // Middleware
exports.authenticate = (req, res, next) => {
    console.log('Authenticating...'); // Debugging line
    const authHeader = req.headers['authorization'] || '';
    const authCookie = req.cookies['auth-cookie'] || '';
    console.log('Auth header:', authHeader); // Debugging line
    console.log('Auth cookie:', authCookie); // Debugging line
    const [scheme, token] = authHeader.split(' ');
    if (!authCookie) {
        console.log('No token provided'); // Debugging line
      return res.status(401).json({ error: 'Unauthorized' });
      
    }
    console.log('Token received:', token); // Debugging line
    console.log('JWT_SECRET:', JWT_SECRET); // Debugging line
    jwt.verify(authCookie, JWT_SECRET, (err, decoded) => {
        console.log('Decoded token:', decoded); // Debugging line
      if (err) {
        
        console.error('Token verification failed:', err); // Debugging line
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
      req.user = decoded;  // { id, role, iat, exp }
        console.log('Token verified:', req.user); // Debugging line
      next();
    });
  };
  



  exports.authorizeRole = (role) => (req, res, next) => {
    console.log('Authorizing role:', role); // Debugging line
    console.log('User role:', req.user.role); // Debugging line
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };

  exports.verifyRole = (req, res) => {
    const requiredRole = req.headers['x-original-uri'];



    console.log('Required role:', requiredRole); // Debugging line
    console.log('User role:', req.user.role); // Debugging line



    if(req.user.role === 'Admin') {
        console.log('Admin access granted'); // Debugging line
      return res.status(200).end();  // Admin can access all roles
    }

    if(requiredRole.includes('employee') && req.user.role == 'Employé') {
        return res.status(200).end();  // Employee can access employee routes
    }
    if(requiredRole.includes('technicien') && req.user.role == 'Technicien') {
        return res.status(200).end();  // Technician can access technician routes
    }

    
        console.log('Access denied'); // Debugging line
        console.log('User role:', req.user.role); // Debugging line
        console.log('Required role:', requiredRole); // Debugging line
      return res.status(403).json({ error: 'Forbidden' });
    
     
  };
