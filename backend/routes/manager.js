const express = require('express');
const router = express.Router();
const db = require('../db');




router.get('/tickets', (req, res) => {
    const userId = req.user.id; // Assuming req.user is set by your authentication middleware
    console.log(userId);
    db.all('SELECT * FROM tickets WHERE id_technicien = ?', [userId], (err, rows) => {
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

router.put('/tickets/:id', (req, res) => {
    const ticketId = req.params.id;
    const { statut,commentaire } = req.body;

    db.run('UPDATE tickets SET statut = ?, date_mise_a_jour = CURRENT_TIMESTAMP WHERE id = ?', 
        [statut, ticketId], function(err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Ticket not found' });
            }

            db.run('INSERT INTO comments (ticket_id, auteur_id, contenu) VALUES (?, ?, ?)', 
                [ticketId, req.user.id, commentaire], function(err) {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ error: 'Database error' });
                    }
                    res.status(200).json({ message: 'Ticket updated successfully', commentId: this.lastID });
                });
        });
    
    
    });


module.exports = router;