import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import authMiddleware from './middleware/auth.js';
import path from 'path';

//require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
console.log('authRoutes:', authRoutes);  
app.use('/api/users', userRoutes);
console.log('userRoutes:', userRoutes);  
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Protected data', user: req.user });
});

app.listen(5000, () => console.log('Server on port 5000'));
