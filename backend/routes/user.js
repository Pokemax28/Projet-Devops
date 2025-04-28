const express = require('express');
const router = express.Router();
const db = require('../db');




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


module.exports = router;