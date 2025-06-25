CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL 
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  message TEXT
);