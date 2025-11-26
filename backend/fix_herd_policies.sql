-- Safely drop policies if they exist to avoid "already exists" errors
DROP POLICY IF EXISTS "Users can delete their own herds" ON public.herds;
DROP POLICY IF EXISTS "Users can update their own herds" ON public.herds;
DROP POLICY IF EXISTS "Users can delete members from their own herds" ON public.herd_members;

-- 1. Allow users to delete their own herds
CREATE POLICY "Users can delete their own herds"
    ON public.herds FOR DELETE
    USING (creator_id = auth.uid());

-- 2. Allow users to update their own herds (Renaming)
CREATE POLICY "Users can update their own herds"
    ON public.herds FOR UPDATE
    USING (creator_id = auth.uid());

-- 3. Allow users to remove members from their own herds (Editing members)
CREATE POLICY "Users can delete members from their own herds"
    ON public.herd_members FOR DELETE
    USING (
        (SELECT creator_id FROM public.herds WHERE id = herd_id) = auth.uid()
    );