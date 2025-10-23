const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./Config/database.js');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/test', (req, res) => {
    console.log('Test route hit');
    res.json({ message: 'Test route is working properly!' });
});

app.post('/api/test-post', (req, res) => {
    console.log('Test POST route hit!', req.body);
    res.json({ message: 'Test POST working correctly!', received: req.body });
});

// Basic Routes
app.get('/', (req, res) => {
    res.json({ message: 'Blog API server is up and running!' });
});

app.get('/api', (req, res) => {
    res.json({ message: 'Server is connected successfully!' });
});

const postRoutes = require('./Routes/posts.js');
const categoryRoutes = require('./Routes/categories.js');

app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Sorry, something went wrong. Please try again!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;