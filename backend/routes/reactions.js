const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');

// Get all reactions for a reflection
router.get('/:reflectionId', async (req, res) => {
    const { data, error } = await supabase
        .from('reactions')
        .select('*')
        .eq('reflection_id', req.params.reflectionId);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Create a new reaction
router.post('/', async (req, res) => {
    const { reflection_id, user_id, reaction_type } = req.body;
    const { data, error } = await supabase
        .from('reactions')
        .insert([{ reflection_id, user_id, reaction_type }]);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Delete a reaction
router.delete('/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('reactions')
        .delete()
        .eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

module.exports = router;