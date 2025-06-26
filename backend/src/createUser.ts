import bcrypt from 'bcrypt';
import { Pool } from 'pg';

const pool = new Pool({
	host: 'db',
	user: 'xpuser',
	password: 'xppass',
	database: 'xpdb',
});

async function createUser(username: string, password: string) {
	const client = await pool.connect();
	try {
		const existing = await client.query('SELECT 1 FROM users WHERE username = $1', [username]);
		if (existing.rowCount)
			return;
		
		const hash = await bcrypt.hash(password, 10);
		await client.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hash]);
	} catch (err) {
		console.error(err);
	} finally {
		client.release();
		await pool.end();
	}
}

createUser('quentin.cherel18@gmail.com', 'password');
