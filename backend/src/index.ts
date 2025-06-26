import express from 'express';
import cors from 'cors';
import loginRouter from './routes/login';
import signalRouter from './routes/signal';

const app = express();
const PORT = 3000;

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

app.use('/api/login', loginRouter);
app.use('/api/signal', signalRouter)

app.listen(PORT);
