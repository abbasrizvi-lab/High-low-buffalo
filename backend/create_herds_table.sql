-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.herd_members;
DROP TABLE IF EXISTS public.herds;

-- Create the herds table
CREATE TABLE public.herds (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    creator_id uuid NOT NULL,
    name character varying NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT herds_pkey PRIMARY KEY (id),
    CONSTRAINT herds_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Create the herd_members table
CREATE TABLE public.herd_members (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    herd_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT herd_members_pkey PRIMARY KEY (id),
    CONSTRAINT herd_members_herd_id_fkey FOREIGN KEY (herd_id) REFERENCES public.herds(id) ON DELETE CASCADE,
    CONSTRAINT herd_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
    CONSTRAINT herd_members_herd_id_user_id_key UNIQUE (herd_id, user_id)
);

-- Add Row Level Security policies for herds
ALTER TABLE public.herds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own herds"
    ON public.herds FOR SELECT
    USING (creator_id = auth.uid());

CREATE POLICY "Users can insert their own herds"
    ON public.herds FOR INSERT
    WITH CHECK (auth.uid() = creator_id);

-- Add Row Level Security policies for herd_members
ALTER TABLE public.herd_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view members of their own herds"
    ON public.herd_members FOR SELECT
    USING (
        is_user_in_herd(herd_id, auth.uid())
    );

CREATE POLICY "Users can insert members into their own herds"
    ON public.herd_members FOR INSERT
    WITH CHECK (
        (SELECT creator_id FROM public.herds WHERE id = herd_id) = auth.uid()
    );