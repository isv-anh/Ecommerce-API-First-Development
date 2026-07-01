-- ROLES
INSERT INTO
    roles (role_id, role_name)
VALUES (gen_random_uuid (), 'USER'),
    (gen_random_uuid (), 'ADMIN')
ON CONFLICT (role_name) DO NOTHING;


-- PERMISSIONS

INSERT INTO permissions (pid, code, action, subject)
VALUES
-- PRODUCT
(gen_random_uuid(), 'product:create', 'create', 'Product'),
(gen_random_uuid(), 'product:read', 'read', 'Product'),
(gen_random_uuid(), 'product:update', 'update', 'Product'),
(gen_random_uuid(), 'product:delete', 'delete', 'Product'),

-- BRAND
(gen_random_uuid(), 'brand:create', 'create', 'Brand'),
(gen_random_uuid(), 'brand:read', 'read', 'Brand'),
(gen_random_uuid(), 'brand:update', 'update', 'Brand'),
(gen_random_uuid(), 'brand:delete', 'delete', 'Brand'),

-- CART
(gen_random_uuid(), 'cart:create', 'create', 'Cart'),
(gen_random_uuid(), 'cart:read', 'read', 'Cart'),
(gen_random_uuid(), 'cart:update', 'update', 'Cart'),
(gen_random_uuid(), 'cart:delete', 'delete', 'Cart'),
(gen_random_uuid(), 'cart:checkout', 'checkout', 'Cart'),

-- ORDER
(gen_random_uuid(), 'order:create', 'create', 'Order'),
(gen_random_uuid(), 'order:read', 'read', 'Order'),
(gen_random_uuid(), 'order:update', 'update', 'Order'),
(gen_random_uuid(), 'order:cancel', 'cancel', 'Order'),
(gen_random_uuid(), 'order:approve', 'approve', 'Order'),
(gen_random_uuid(), 'order:reject', 'reject', 'Order'),

-- VOUCHER
(gen_random_uuid(), 'voucher:create', 'create', 'Voucher'),
(gen_random_uuid(), 'voucher:read', 'read', 'Voucher'),
(gen_random_uuid(), 'voucher:update', 'update', 'Voucher'),
(gen_random_uuid(), 'voucher:delete', 'delete', 'Voucher'),

-- ADDRESS
(gen_random_uuid(), 'address:create', 'create', 'Address'),
(gen_random_uuid(), 'address:read', 'read', 'Address'),
(gen_random_uuid(), 'address:update', 'update', 'Address'),
(gen_random_uuid(), 'address:delete', 'delete', 'Address'),

-- REVIEW
(gen_random_uuid(), 'review:create', 'create', 'Review'),
(gen_random_uuid(), 'review:read', 'read', 'Review'),
(gen_random_uuid(), 'review:update', 'update', 'Review'),
(gen_random_uuid(), 'review:delete', 'delete', 'Review'),
(gen_random_uuid(), 'review:approve', 'approve', 'Review'),
(gen_random_uuid(), 'review:reject', 'reject', 'Review'),

-- WISHLIST
(gen_random_uuid(), 'wishlist:create', 'create', 'Wishlist'),
(gen_random_uuid(), 'wishlist:read', 'read', 'Wishlist'),
(gen_random_uuid(), 'wishlist:delete', 'delete', 'Wishlist');


-- ROLE PERMISSIONS

-- ───────────────── USER ─────────────────

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.pid
FROM roles r
JOIN permissions p
  ON p.code IN (
    -- PRODUCT
    'product:read',

    -- BRAND
    'brand:read',

    -- CART
    'cart:create',
    'cart:read',
    'cart:update',
    'cart:delete',
    'cart:checkout',

    -- ORDER
    'order:create',
    'order:read',
    'order:cancel',

    -- ADDRESS
    'address:create',
    'address:read',
    'address:update',
    'address:delete',

    -- REVIEW
    'review:create',
    'review:read',
    'review:update',
    'review:delete',

    -- WISHLIST
    'wishlist:create',
    'wishlist:read',
    'wishlist:delete',

    -- VOUCHER
    'voucher:read'
  )
WHERE r.role_name = 'USER';

-- ───────────────── ADMIN ───────────────

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.pid
FROM roles r
CROSS JOIN permissions p
WHERE r.role_name = 'ADMIN';
