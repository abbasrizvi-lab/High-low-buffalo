const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');

// Get all connections
router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('connections')
        .select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Get connection by id
router.get('/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('connections')
        .select('*')
        .eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Create a new connection
router.post('/', async (req, res) => {
    const { requester_id, email, status, access_token, refresh_token } = req.body;

    await supabase.auth.setSession({
        access_token,
        refresh_token,
    });

    const { data: recipient_id, error: rpcError } = await supabase.rpc(
        "get_user_id_by_email",
        { user_email: email }
    );

    if (rpcError) {
        return res.status(500).json({ error: rpcError.message });
    }

    if (!recipient_id) {
        return res.status(404).json({ error: "Recipient not found" });
    }

    const { data, error } = await supabase
        .from('connections')
        .insert([{ requester_id, recipient_id, status }]);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json(data);
});

// Update a connection
router.put('/:id', async (req, res) => {
    const { status } = req.body;
    const { data, error } = await supabase
        .from('connections')
        .update({ status })
        .eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Delete a connection
router.delete('/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('connections')
        .delete()
        .eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

module.exports = router;