import express from 'express';
import cors from 'cors'; 
import 'dotenv/config';
import cookieParser from 'cookie-parser';

const app = express();
const port = process.env.PORT || 5000;
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
app.use(cors({credentials: true}));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello World!');
});
connectDB();
app.use('/api/auth', authRouter);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app; 