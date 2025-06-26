"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    host: 'db',
    user: 'xpuser',
    password: 'xppass',
    database: 'xpdb',
});
async function createUser() {
    const username = 'quentin.cherel18@gmail.com';
    const password = 'password';
    const hash = await bcrypt_1.default.hash(password, 10);
    await pool.query('INSERT INTO users (username, password) VALUES ($1, $2) ON CONFLICT DO NOTHING', [username, hash]);
}
createUser().then(() => process.exit());
