import bcrypt from 'bcrypt';
import { Pool } from 'pg';

const pool = new Pool({
  host: 'db',
  user: 'xpuser',
  password: 'xppass',
  database: 'xpdb',
});

async function createUser() {
  const username = 'quentin.cherel18@gmail.com';
  const password = 'password';
  const hash = await bcrypt.hash(password, 10);

  await pool.query('INSERT INTO users (username, password) VALUES ($1, $2) ON CONFLICT DO NOTHING', [username, hash]);
}

createUser().then(() => process.exit());
