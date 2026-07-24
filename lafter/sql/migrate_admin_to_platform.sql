-- Migration: Move admin role from lafter.users to gangdev.users (platform-level)
-- Run these in order:

-- 1. Add role column to gangdev.users
ALTER TABLE gangdev.users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';

-- 2. Make yourself platform admin
UPDATE gangdev.users SET role = 'admin' WHERE id = 1;

-- 3. Drop role from lafter.users (no longer needed there)
ALTER TABLE lafter.users DROP COLUMN IF EXISTS role;

-- 4. Still need your lafter.users row for riot data
INSERT INTO lafter.users (gangdev_user_id, riot_name, riot_tag)
VALUES (1, 'Serided', 'RoHan')
ON CONFLICT (gangdev_user_id) DO UPDATE SET riot_name = 'Serided', riot_tag = 'RoHan';
