const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');

// User registration
router.post('/register', async (req, res) => {
    const { email, password, fullName } = req.body;
    const { user, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            }
        }
    });

    if (error) {
        console.log(error); // For more detailed error logging
        if (error.code === 'email_address_invalid') {
            return res.status(400).json({
                code: error.code,
                message: `The email address "${email}" is invalid. Please check for typos or try a different address.`
            });
        }
        return res.status(400).json({ error: error.message });
    }
    res.status(201).json({ user });
});

// User login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
});

module.exports = router;