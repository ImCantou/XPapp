import { Router } from 'express';
import { Pool } from 'pg';

const signalRouter = Router();
const pool = new Pool({
  host: 'db',
  user: 'xpuser',
  password: 'xppass',
  database: 'xpdb',
});

function analyzeSignal(signal: number[]) {
  const n = signal.length;
  const time = signal.map((_, i) => i * 0.01);

  let maxAmp = 0;
  let dominantFreq = 0;

  for (let f = 10; f <= 20; f += 0.1) {
    let real = 0;
    let imag = 0;

    for (let i = 0; i < n; i++) {
		const t = time[i];
      	const w = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (n - 1))); // Hann window
      	const sample = signal[i] * w;
      	const angle = 2 * Math.PI * f * t;
      	real += sample * Math.cos(angle);
      	imag += sample * Math.sin(angle);
    }

	const amplitude = (2 / n) * Math.sqrt(real ** 2 + imag ** 2);
    if (amplitude > maxAmp) {
      maxAmp = amplitude;
      dominantFreq = f;
    }
  }

  return {
    dominantFreq,
    dominantAmp: maxAmp
  };
}

signalRouter.get('/', async (req, res) => {
  const { rows } = await pool.query('SELECT id FROM measures ORDER BY id');
  res.json(rows);
});

signalRouter.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const result = await pool.query(
    'SELECT signal FROM measures WHERE id = $1',
    [id]
  );

  if (result.rows.length === 0) return res.sendStatus(404);

  const { signal } = result.rows[0];
  const analysis = analyzeSignal(signal);

  res.json({ signal, analysis });
});

export default signalRouter;
