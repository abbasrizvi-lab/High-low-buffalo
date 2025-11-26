const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');
const authenticate = require('../middleware/auth');

// Get all herds for the current user
router.get('/', authenticate, async (req, res) => {
    const { data, error } = await req.supabase
        .from('herds')
        .select('*, members:herd_members(*, user:user_id(id, email, username))');
        
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
router.post('/', authenticate, async (req, res) => {
    const { name, members } = req.body; // members is an array of user_ids
    const creator_id = req.user.id;

    // 1. Create the herd
    const { data: herdData, error: herdError } = await req.supabase
        .from('herds')
        .insert([{ name, creator_id }])
        .select()
        .single();

    if (herdError) return res.status(500).json({ error: herdError.message });

    const herdId = herdData.id;

    // 2. Add members if any
    if (members && members.length > 0) {
        const memberInserts = members.map(userId => ({
            herd_id: herdId,
            user_id: userId
        }));

        const { error: memberError } = await req.supabase
            .from('herd_members')
            .insert(memberInserts);

        if (memberError) {
            // Optional: Rollback herd creation (delete it) if adding members fails
            // For now, we'll just report the error
            return res.status(500).json({ error: "Herd created but failed to add members: " + memberError.message });
        }
    }

    res.json(herdData);
});

// Update a herd
router.put('/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    const { name, members } = req.body;
    const creator_id = req.user.id;

    // 1. Update herd name
    const { data: herdData, error: herdError } = await req.supabase
        .from('herds')
        .update({ name })
        .eq('id', id)
        .eq('creator_id', creator_id)
        .select();

    if (herdError) return res.status(500).json({ error: herdError.message });
    
    if (!herdData || herdData.length === 0) {
        return res.status(404).json({ error: "Herd not found or not authorized to update" });
    }

    // 2. Update members (replace all)
    if (members) {
        // Delete existing members
        const { error: deleteError } = await req.supabase
            .from('herd_members')
            .delete()
            .eq('herd_id', id);
        
        if (deleteError) return res.status(500).json({ error: deleteError.message });

        // Insert new members
        if (members.length > 0) {
            const memberInserts = members.map(userId => ({
                herd_id: id,
                user_id: userId
            }));

            const { error: insertError } = await req.supabase
                .from('herd_members')
                .insert(memberInserts);
            
            if (insertError) return res.status(500).json({ error: insertError.message });
        }
    }

    res.json(herdData[0]);
});

// Delete a herd
router.delete('/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    
    const { error, count } = await req.supabase
        .from('herds')
        .delete({ count: 'exact' })
        .eq('id', id)
        .eq('creator_id', req.user.id);

    if (error) return res.status(500).json({ error: error.message });
    
    if (count === 0) {
        return res.status(404).json({ error: "Herd not found or not authorized to delete" });
    }

    res.status(204).send();
});

// Leave a herd
router.post('/:id/leave', authenticate, async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;

    const { error, count } = await req.supabase
        .from('herd_members')
        .delete({ count: 'exact' })
        .eq('herd_id', id)
        .eq('user_id', user_id);

    if (error) return res.status(500).json({ error: error.message });

    if (count === 0) {
        return res.status(404).json({ error: "Herd member record not found" });
    }

    res.status(200).json({ message: "Left herd successfully" });
});

module.exports = router;