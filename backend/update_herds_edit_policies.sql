-- Policy: Users can update their own herds
CREATE POLICY "Users can update their own herds"
    ON public.herds FOR UPDATE
    USING (creator_id = auth.uid());

-- Policy: Users can delete members from their own herds
CREATE POLICY "Users can delete members from their own herds"
    ON public.herd_members FOR DELETE
    USING (
        (SELECT creator_id FROM public.herds WHERE id = herd_id) = auth.uid()
    );