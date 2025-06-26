import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

const app = express();
const PORT = 3000;
const SECRET_KEY = 'sinusoidFunctions';

const pool = new Pool({
  host: 'db',
  user: 'xpuser',
  password: 'xppass',
  database: 'xpdb',
});

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userResult.rowCount === 0) {
      return res.status(401).json({ message: 'Login failed' });
    }

    const user = userResult.rows[0];
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Login failed' });
    }

    const token = jwt.sign({ username: user.username, id: user.id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Auth API running on http://localhost:${PORT}`);
});
