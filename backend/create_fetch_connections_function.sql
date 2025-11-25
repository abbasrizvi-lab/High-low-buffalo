CREATE OR REPLACE FUNCTION fetch_connections()
RETURNS TABLE(
    id uuid,
    requester_id uuid,
    recipient_id uuid,
    status text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    user_id uuid,
    user_name text,
    user_email text,
    user_avatar_url text
)
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id,
        c.requester_id,
        c.recipient_id,
        c.status,
        c.created_at,
        c.updated_at,
        u.id as user_id,
        u.raw_user_meta_data->>'full_name' as user_name,
        u.email::text as user_email,
        u.raw_user_meta_data->>'avatar_url' as user_avatar_url
    FROM
        public.connections c
    JOIN
        auth.users u ON (c.requester_id = u.id AND c.recipient_id = auth.uid()) OR (c.recipient_id = u.id AND c.requester_id = auth.uid())
    WHERE
        (c.requester_id = auth.uid() OR c.recipient_id = auth.uid());
END;
$$;