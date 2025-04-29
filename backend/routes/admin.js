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




router.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (!row) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(row);
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
            res.status(200).json({ id: this.lastID });
        });
});

router.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const { nom, email, mot_de_passe, role } = req.body;
    let hashedPassword = mot_de_passe ? bcrypt.hashSync(mot_de_passe, 10) : undefined; // Hash the password if provided

    db.run('UPDATE users SET nom = ?, email = ?, role = ? WHERE id = ?', 
        [nom, email,  role, userId], function(err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json({ message: 'User updated successfully' });
        });
});

router.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    db.run('DELETE FROM users WHERE id = ?', [userId], function(err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    });
});

router.get('/technicians', (req, res) => {
    db.all('SELECT * FROM users WHERE role = ?', ['Technicien'], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        console.log(rows);
        res.json(rows);
    });
});


router.post('/tickets/:id/assign', (req, res) => {
    const ticketId = req.params.id;
    const { technicianId } = req.body;
    console.log("ID :",technicianId);

    db.run('UPDATE tickets SET id_technicien = ?, date_mise_a_jour = CURRENT_TIMESTAMP WHERE id = ?', 
        [technicianId, ticketId], function(err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Ticket not found' });
            }
            res.status(200).json({ message: 'Ticket assigned successfully' });
        });
});


module.exports = router;