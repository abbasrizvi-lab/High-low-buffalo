const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const authenticate = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Access token is required');
  }

  // Create a scoped Supabase client for this request using the user's token
  // This ensures that all database operations perform RLS checks as this user
  const scopedSupabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    }
  );

  // Validate the token and get the user
  const { data: { user }, error } = await scopedSupabase.auth.getUser();

  if (error || !user) {
    console.error('Auth error:', error);
    return res.sendStatus(403);
  }

  // Attach the user and the scoped client to the request
  req.user = user;
  req.supabase = scopedSupabase;
  
  next();
};

module.exports = authenticate;