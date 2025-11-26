-- Update RLS policy for herd_members to allow creator to view members
DROP POLICY IF EXISTS "Users can view members of their own herds" ON public.herd_members;

CREATE POLICY "Users can view members of their own herds"
    ON public.herd_members FOR SELECT
    USING (
        is_user_in_herd(herd_id, auth.uid()) OR
        (SELECT creator_id FROM public.herds WHERE id = herd_id) = auth.uid()
    );