const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');

// Get all users
router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('users')
        .select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Get user by id
router.get('/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

module.exports = router;