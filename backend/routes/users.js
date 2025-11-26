const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');
const authenticate = require('../middleware/auth');

// Get all users
router.get('/', authenticate, async (req, res) => {
    const { data, error } = await req.supabase
        .from('users')
        .select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Get current user profile
router.get('/me', authenticate, async (req, res) => {
    const { data, error } = await req.supabase
        .from('users')
        .select('*')
        .eq('id', req.user.id)
        .single();
    
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Update current user profile
router.put('/me', authenticate, async (req, res) => {
    const { check_in_time, check_in_enabled } = req.body;
    
    const { data, error } = await req.supabase
        .from('users')
        .update({ check_in_time, check_in_enabled })
        .eq('id', req.user.id)
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Get user by id
router.get('/:id', authenticate, async (req, res) => {
    const { data, error } = await req.supabase
        .from('users')
        .select('*')
        .eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

module.exports = router;