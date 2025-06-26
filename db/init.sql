DROP TABLE IF EXISTS sinusoids;
DROP TABLE IF EXISTS measures;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE measures (
  id SERIAL PRIMARY KEY,
  duration REAL NOT NULL,
  dominant_freq REAL NOT NULL,
  dominant_amp REAL NOT NULL,
  signal REAL[] NOT NULL
);

CREATE TABLE sinusoids (
  id SERIAL PRIMARY KEY,
  measure_id INTEGER REFERENCES measures(id) ON DELETE CASCADE,
  frequency REAL NOT NULL,
  amplitude REAL NOT NULL
);
