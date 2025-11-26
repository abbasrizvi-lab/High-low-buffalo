const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');
const authenticate = require('../middleware/auth');

// Get reminder status for a reflection
router.get('/:reflectionId', authenticate, async (req, res) => {
    const { data, error } = await req.supabase
        .from('reminders')
        .select('*')
        .eq('reflection_id', req.params.reflectionId)
        .eq('user_id', req.user.id)
        .maybeSingle();

    if (error) return res.status(500).json({ error: error.message });
    res.json({ hasReminder: !!data, id: data?.id });
});

// Create a reminder
router.post('/', authenticate, async (req, res) => {
    const { reflection_id } = req.body;
    const user_id = req.user.id;

    const { data, error } = await req.supabase
        .from('reminders')
        .insert([{ reflection_id, user_id }])
        .select()
        .single();

    if (error) {
        // Ignore unique constraint violation (duplicate reminder)
        if (error.code === '23505') return res.status(200).json({ message: "Reminder already exists" });
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
});

// Delete a reminder
router.delete('/:id', authenticate, async (req, res) => {
    const { error } = await req.supabase
        .from('reminders')
        .delete()
        .eq('id', req.params.id)
        .eq('user_id', req.user.id);

    if (error) return res.status(500).json({ error: error.message });
    res.status(204).send();
});

module.exports = router;