// Load environment variables from .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));



app.use(express.static('public'));

// Import routes
const authRoute = require('./routes/auth');
const todoRoute = require('./routes/todo');

// Use routes
app.use('/api/auth', authRoute);
app.use('/api/todos', todoRoute);

// Test route
app.get('/', (req, res) => {
    res.send('Backend is ready!');
});

app.get('/healthz', (req, res) => {
    res.status(200).send('OK');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
