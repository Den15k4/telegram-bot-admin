-- src/db/init-admin.sql
-- Создание таблицы администраторов
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'support', 'viewer')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMPTZ
);

-- Создание первого администратора (пароль: admin123)
INSERT INTO admin_users (email, password_hash, role)
VALUES (
    'admin@example.com',
    '$2a$10$rStLwqtXFoHxuBcLJm3KPeyvHHPMyRQ5.bALUx0vQ6GTkPWRK2m3C',
    'admin'
) ON CONFLICT (email) DO NOTHING;
