"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginHandler = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const pg_1 = require("pg");
const SECRET_KEY = 'your-secret-key';
const pool = new pg_1.Pool({
    host: 'db',
    user: 'xpuser',
    password: 'xppass',
    database: 'xpdb',
});
const loginHandler = async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rowCount === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const user = result.rows[0];
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.loginHandler = loginHandler;
