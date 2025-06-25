import bcrypt from 'bcrypt';
import { Pool } from 'pg';

const pool = new Pool({
  host: 'db',
  user: 'saasuser',
  password: 'saaspass',
  database: 'saasdb',
});

async function createUser() {
  const username = 'admin';
  const plainPassword = 'password';
  const hash = await bcrypt.hash(plainPassword, 10);

  await pool.query('INSERT INTO users (username, password) VALUES ($1, $2) ON CONFLICT DO NOTHING', [username, hash]);
  console.log('User created.');
}

createUser().then(() => process.exit());
