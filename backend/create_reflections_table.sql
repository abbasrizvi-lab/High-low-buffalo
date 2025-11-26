-- Drop the existing table if it exists
DROP TABLE IF EXISTS public.reflections;

-- Create the reflections table
CREATE TABLE public.reflections (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    author_id uuid NOT NULL,
    high_text text,
    low_text text,
    buffalo_text text,
    high_image_url text,
    low_image_url text,
    buffalo_image_url text,
    audience_type text NOT NULL,
    audience_id uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT reflections_pkey PRIMARY KEY (id),
    CONSTRAINT reflections_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE CASCADE,
    CONSTRAINT high_content_check CHECK (high_text IS NOT NULL OR high_image_url IS NOT NULL),
    CONSTRAINT low_content_check CHECK (low_text IS NOT NULL OR low_image_url IS NOT NULL),
    CONSTRAINT buffalo_content_check CHECK (buffalo_text IS NOT NULL OR buffalo_image_url IS NOT NULL)
);

-- Add Row Level Security policies
ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view reflections shared with them or their herds
CREATE POLICY "Users can view their own or shared reflections"
    ON public.reflections FOR SELECT
    USING (
        author_id = auth.uid() OR
        (audience_type = 'user' AND audience_id = auth.uid()) OR
        (audience_type = 'herd' AND is_user_in_herd(audience_id, auth.uid()))
    );

-- Policy: Users can insert their own reflections
CREATE POLICY "Users can insert their own reflections"
    ON public.reflections FOR INSERT
    WITH CHECK (auth.uid() = author_id);

-- Policy: Users can delete their own reflections
CREATE POLICY "Users can delete their own reflections"
    ON public.reflections FOR DELETE
    USING (auth.uid() = author_id);