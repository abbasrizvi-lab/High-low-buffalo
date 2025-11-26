-- Drop the existing connections table if it exists
DROP TABLE IF EXISTS public.connections;

-- Enable the moddatetime extension
CREATE EXTENSION IF NOT EXISTS moddatetime;

-- Create the connections table
CREATE TABLE public.connections (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    requester_id uuid NOT NULL,
    recipient_id uuid NOT NULL,
    status text NOT NULL DEFAULT 'pending'::text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT connections_pkey PRIMARY KEY (id),
    CONSTRAINT connections_requester_id_fkey FOREIGN KEY (requester_id) REFERENCES public.users(id) ON DELETE CASCADE,
    CONSTRAINT connections_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES public.users(id) ON DELETE CASCADE,
    CONSTRAINT unique_connection UNIQUE (requester_id, recipient_id),
    CONSTRAINT check_requester_recipient CHECK (requester_id <> recipient_id)
);

-- Add a trigger to automatically update the updated_at timestamp
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.connections
    FOR EACH ROW
    EXECUTE PROCEDURE moddatetime('updated_at');

-- Add Row Level Security policies
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own connections
CREATE POLICY "Users can view their own connections"
    ON public.connections FOR SELECT
    USING (requester_id = auth.uid() OR recipient_id = auth.uid());

-- Policy: Users can insert their own connections
CREATE POLICY "Users can insert their own connections"
    ON public.connections FOR INSERT
    WITH CHECK (auth.uid() = requester_id);

-- Policy: Users can update their own connections
CREATE POLICY "Users can update their own connections"
    ON public.connections FOR UPDATE
    USING (auth.uid() = requester_id OR auth.uid() = recipient_id);

-- Policy: Users can delete their own connections
CREATE POLICY "Users can delete their own connections"
    ON public.connections FOR DELETE
    USING (auth.uid() = requester_id OR auth.uid() = recipient_id);
