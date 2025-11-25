const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');

// Get all herds
router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('herds')
        .select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Get herd by id
router.get('/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('herds')
        .select('*')
        .eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Create a new herd
router.post('/', async (req, res) => {
    const { name, creator_id, members } = req.body;
    const { data, error } = await supabase
        .from('herds')
        .insert([{ name, creator_id }]);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

module.exports = router;