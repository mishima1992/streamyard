import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './db.js';

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Test Route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the server! The API is working.' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

