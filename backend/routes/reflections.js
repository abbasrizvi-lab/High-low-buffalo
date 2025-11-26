const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');
const authenticate = require('../middleware/auth');

// Get all reflections
router.get('/', authenticate, async (req, res) => {
  const { data, error } = await req.supabase
    .from('reflections')
    .select('*, author:author_id(id, email, username)');
  
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  
  res.json(data);
});

// Create a new reflection
router.post('/', authenticate, async (req, res) => {
  const {
    high_text, low_text, buffalo_text,
    high_image_url, low_image_url, buffalo_image_url,
    audience_type, audience_id: raw_audience_id
  } = req.body;
  const author_id = req.user.id; // Use the authenticated user's ID
  
  const audience_id = audience_type === 'self' ? null : raw_audience_id;

  const { data, error } = await req.supabase
    .from('reflections')
    .insert([{
      high_text, low_text, buffalo_text,
      high_image_url, low_image_url, buffalo_image_url,
      author_id, audience_type, audience_id
    }])
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json(data);
});

// Delete a reflection
router.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  
  const { error, count } = await req.supabase
    .from('reflections')
    .delete({ count: 'exact' })
    .eq('id', id)
    .eq('author_id', req.user.id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (count === 0) {
    return res.status(404).json({ error: "Reflection not found or not authorized to delete" });
  }

  res.status(204).send();
});

module.exports = router;