-- Create a security definer function to get herd creator
-- This bypasses RLS on the herds table to prevent recursion
CREATE OR REPLACE FUNCTION get_herd_creator(herd_id_input uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    creator uuid;
BEGIN
    SELECT creator_id INTO creator
    FROM public.herds
    WHERE id = herd_id_input;
    RETURN creator;
END;
$$;

-- Update the herd_members policy to use the function
DROP POLICY IF EXISTS "Users can view members of their own herds" ON public.herd_members;

CREATE POLICY "Users can view members of their own herds"
    ON public.herd_members FOR SELECT
    USING (
        is_user_in_herd(herd_id, auth.uid()) OR
        get_herd_creator(herd_id) = auth.uid()
    );