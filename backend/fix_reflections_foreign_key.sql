-- Fix relationship between reflections and users tables
-- This is necessary for Supabase to detect the foreign key for joins

-- 1. Drop the existing foreign key constraint (referencing auth.users)
-- Note: The default name is usually tablename_columnname_fkey
ALTER TABLE reflections
DROP CONSTRAINT IF EXISTS reflections_author_id_fkey;

-- 2. Add new foreign key constraint referencing public.users
ALTER TABLE reflections
ADD CONSTRAINT reflections_author_id_fkey
FOREIGN KEY (author_id)
REFERENCES public.users (id)
ON DELETE CASCADE;