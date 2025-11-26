CREATE OR REPLACE FUNCTION is_user_in_herd(herd_id_to_check uuid, user_id_to_check uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.herd_members
    WHERE herd_id = herd_id_to_check AND user_id = user_id_to_check
  );
END;
$$;