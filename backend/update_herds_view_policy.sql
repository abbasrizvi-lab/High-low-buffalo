-- Allow users to view herds they are members of
CREATE POLICY "Users can view herds they are members of"
    ON public.herds FOR SELECT
    USING (
        id IN (
            SELECT herd_id FROM public.herd_members WHERE user_id = auth.uid()
        )
    );