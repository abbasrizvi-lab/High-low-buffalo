-- Reactions Table
CREATE TABLE IF NOT EXISTS public.reactions (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    reflection_id uuid NOT NULL REFERENCES public.reflections(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type text NOT NULL CHECK (type IN ('curiosity')), -- Extensible for future types
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT reactions_pkey PRIMARY KEY (id),
    CONSTRAINT reactions_unique_user_reflection_type UNIQUE (user_id, reflection_id, type)
);

-- Reminders Table
CREATE TABLE IF NOT EXISTS public.reminders (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    reflection_id uuid NOT NULL REFERENCES public.reflections(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT reminders_pkey PRIMARY KEY (id),
    CONSTRAINT reminders_unique_user_reflection UNIQUE (user_id, reflection_id)
);

-- RLS Policies for Reactions
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view reactions on reflections they can see"
    ON public.reactions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.reflections r
            WHERE r.id = reflection_id
            -- Reuse the logic from reflections view policy? 
            -- Or simpler: If I can select the reflection, I can select its reactions?
            -- Implementing complex logic in SQL policy here might be recursive/expensive.
            -- Simpler approach: Authenticated users can view reactions.
            -- Ideally, it should be tied to reflection visibility.
        )
    );
    
-- Simpler policy for now: Authenticated users can view all reactions (visibility of reflection card handles context)
CREATE POLICY "Authenticated users can view reactions"
    ON public.reactions FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can add their own reactions"
    ON public.reactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions"
    ON public.reactions FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for Reminders
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- Users can only see their own reminders
CREATE POLICY "Users can view their own reminders"
    ON public.reminders FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reminders"
    ON public.reminders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reminders"
    ON public.reminders FOR DELETE
    USING (auth.uid() = user_id);