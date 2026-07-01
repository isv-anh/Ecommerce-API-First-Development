CREATE EXTENSION IF NOT EXISTS pgcrypto;

WITH admin_user AS (
    INSERT INTO users (
        uid,
        username,
        email,
        password,
        full_name,
        is_active,
        is_deleted,
        created_at,
        updated_at
    )
    VALUES (
        gen_random_uuid(),
        'admin',
        'admin@example.com',
        crypt($admin_password$${adminPassword}$admin_password$, gen_salt('bf', 10)),
        'Administrator',
        true,
        false,
        now(),
        now()
    )
    ON CONFLICT (username) DO UPDATE
    SET
        email = EXCLUDED.email,
        password = EXCLUDED.password,
        full_name = EXCLUDED.full_name,
        is_active = true,
        is_deleted = false,
        updated_at = now()
    RETURNING uid
)
INSERT INTO user_roles (uid, role_id)
SELECT admin_user.uid, roles.role_id
FROM admin_user
CROSS JOIN roles
WHERE roles.role_name = 'ADMIN'
ON CONFLICT DO NOTHING;
