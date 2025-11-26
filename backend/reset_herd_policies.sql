-- 1. Helper Functions (SECURITY DEFINER to bypass RLS recursion)

-- Check if a user is a member of a herd
CREATE OR REPLACE FUNCTION is_user_in_herd(herd_id_to_check uuid, user_id_to_check uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.herd_members
    WHERE herd_id = herd_id_to_check AND user_id = user_id_to_check
  );
END;
$$;

-- Get the creator of a herd
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

-- 2. Clean up existing policies
DROP POLICY IF EXISTS "Users can view their own herds" ON public.herds;
DROP POLICY IF EXISTS "Users can insert their own herds" ON public.herds;
DROP POLICY IF EXISTS "Users can update their own herds" ON public.herds;
DROP POLICY IF EXISTS "Users can delete their own herds" ON public.herds;
DROP POLICY IF EXISTS "Users can view herds they are members of" ON public.herds;

DROP POLICY IF EXISTS "Users can view members of their own herds" ON public.herd_members;
DROP POLICY IF EXISTS "Users can insert members into their own herds" ON public.herd_members;
DROP POLICY IF EXISTS "Users can delete members from their own herds" ON public.herd_members;

-- 3. Policies for 'herds' table

-- SELECT: View if creator OR member
CREATE POLICY "View herds as creator or member"
    ON public.herds FOR SELECT
    USING (
        creator_id = auth.uid() OR
        id IN (
            SELECT herd_id FROM public.herd_members WHERE user_id = auth.uid()
        )
    );

-- INSERT: Authenticated users can create herds
CREATE POLICY "Insert herds"
    ON public.herds FOR INSERT
    WITH CHECK (creator_id = auth.uid());

-- UPDATE: Only creator can update
CREATE POLICY "Update herds as creator"
    ON public.herds FOR UPDATE
    USING (creator_id = auth.uid());

-- DELETE: Only creator can delete
CREATE POLICY "Delete herds as creator"
    ON public.herds FOR DELETE
    USING (creator_id = auth.uid());

-- 4. Policies for 'herd_members' table

-- SELECT: View if creator of herd OR member of herd
CREATE POLICY "View herd members as creator or member"
    ON public.herd_members FOR SELECT
    USING (
        is_user_in_herd(herd_id, auth.uid()) OR
        get_herd_creator(herd_id) = auth.uid()
    );

-- INSERT: Creator adds members
CREATE POLICY "Insert herd members as creator"
    ON public.herd_members FOR INSERT
    WITH CHECK (
        get_herd_creator(herd_id) = auth.uid()
    );

-- DELETE: Creator removes members
CREATE POLICY "Delete herd members as creator"
    ON public.herd_members FOR DELETE
    USING (
        get_herd_creator(herd_id) = auth.uid()
    );