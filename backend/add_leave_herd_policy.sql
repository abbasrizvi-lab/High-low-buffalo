-- Allow users to remove themselves from a herd (Leave Herd)
CREATE POLICY "Users can leave herds"
    ON public.herd_members FOR DELETE
    USING (user_id = auth.uid());