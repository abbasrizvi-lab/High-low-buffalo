-- Add DELETE policy for herds
CREATE POLICY "Users can delete their own herds"
    ON public.herds FOR DELETE
    USING (creator_id = auth.uid());