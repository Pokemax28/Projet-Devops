const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');




router.get('/tickets', (req, res) => {
    const userId = req.user.id; // Assuming req.user is set by your authentication middleware
    console.log(userId);
    db.all('SELECT * FROM tickets WHERE id_employe = ?', [userId], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        console.log(rows);
        res.json(rows);
    });
});

router.post('/tickets', (req, res) => {
    const { titre, description, priorite } = req.body;
    const userId = req.user.id; // Assuming req.user is set by your authentication middleware

    db.run('INSERT INTO tickets (titre, description, priorite, id_employe) VALUES (?, ?, ?, ?)', 
        [titre, description, priorite, userId], function(err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(201).json({ id: this.lastID });
        });


});


router.get('/users', (req, res) => {
    console.log('Fetching all users');
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        console.log(rows);
        res.json(rows);
    });
});

router.post('/users', (req, res) => {
    const { nom, email, mot_de_passe, role } = req.body;
    hashedPassword = bcrypt.hashSync(mot_de_passe, 10); // Hash the password
    db.run('INSERT INTO users (nom, email, mot_de_passe, role) VALUES (?, ?, ?, ?)', 
        [nom, email, hashedPassword, role], function(err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(200);
        });
});


module.exports = router;