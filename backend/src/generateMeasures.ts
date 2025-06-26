import { Pool } from 'pg';

const SAMPLE_RATE = 100;
const NUM_MEASURES = 1000;

const pool = new Pool({
	host: 'db',
	user: 'xpuser',
	password: 'xppass',
	database: 'xpdb',
});

function randomFloat(min: number, max: number): number {
	return Math.random() * (max - min) + min;
}

function generateSinusoids(): { frequency: number, amplitude: number }[] {
	const count = Math.floor(Math.random() * 3) + 1;
	const sinusoids = [];
	const dominantFreq = randomFloat(10, 20);
	const dominantAmp = randomFloat(1, 10);
	sinusoids.push({ frequency: dominantFreq, amplitude: dominantAmp });

	for (let i = 1; i < count; i++) {
		let freq: number;
		do {
			freq = randomFloat(1, 50);
		} while (freq >= 10 && freq <= 20);

		const amp = randomFloat(1, 10);
		sinusoids.push({ frequency: freq, amplitude: amp });
	}
	return sinusoids;
}

function generateSignal(sinusoids: { frequency: number, amplitude: number }[], duration: number): number[] {
	const samples = Math.floor(duration * SAMPLE_RATE);
	const signal: number[] = [];

	for (let i = 0; i < samples; i++) {
		const t = i / SAMPLE_RATE;
		let value = 0;
		for (const s of sinusoids) {
			value += s.amplitude * Math.sin(2 * Math.PI * s.frequency * t);
		}
		signal.push(value);
	}

	return signal;
}

async function generateMeasures() {
	const client = await pool.connect();
	try {
		for (let i = 0; i < NUM_MEASURES; i++) {
			const duration = randomFloat(1, 100);
			const sinusoids = generateSinusoids();
			const signal = generateSignal(sinusoids, duration);

			const dominant = sinusoids[0];
			const res = await client.query(
				'INSERT INTO measures (duration, dominant_freq, dominant_amp, signal) VALUES ($1, $2, $3, $4) RETURNING id',
				[duration, dominant.frequency, dominant.amplitude, signal]
			);

			const measureId = res.rows[0].id;
			for (const s of sinusoids) {
				await client.query(
					'INSERT INTO sinusoids (measure_id, frequency, amplitude) VALUES ($1, $2, $3)',
					[measureId, s.frequency, s.amplitude]
				);
			}
		}
	} catch (err) {
		console.error(err);
	} finally {
		client.release();
		await pool.end();
	}
}

generateMeasures();
