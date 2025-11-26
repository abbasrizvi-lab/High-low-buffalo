-- Create a new storage bucket for reflections
INSERT INTO storage.buckets (id, name, public)
VALUES ('reflections', 'reflections', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload reflection images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'reflections' );

-- Policy: Allow public to view reflection images
CREATE POLICY "Anyone can view reflection images"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'reflections' );