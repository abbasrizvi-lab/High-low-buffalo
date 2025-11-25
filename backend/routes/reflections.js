const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');

// Get all reflections
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('reflections')
    .select('*');
  
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  
  res.json(data);
});

module.exports = router;