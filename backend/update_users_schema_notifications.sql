-- Add notification settings to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS check_in_time TIME WITHOUT TIME ZONE DEFAULT '18:00:00',
ADD COLUMN IF NOT EXISTS check_in_enabled BOOLEAN DEFAULT true;