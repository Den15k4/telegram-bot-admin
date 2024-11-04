CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMPTZ
);

INSERT INTO admin_users (email, password_hash, role)
SELECT 'admin@example.com', '$2a$10$rStLwqtXFoHxuBcLJm3KPeyvHHPMyRQ5.bALUx0vQ6GTkPWRK2m3C', 'admin'
WHERE NOT EXISTS (
  SELECT 1 FROM admin_users WHERE email = 'admin@example.com'
);