const express = require('express');
const { getAllStores, createTableStores } = require('./database.js');
const cookieParser = require('cookie-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// Ensure table Stores is created before running the database
createTableStores();

// API route to retrieve stores from the database
app.get('/api/stores', async (req, res) => {

    try {
        const stores = await getAllStores();
        res.json(stores); // Send JSON response from DB
    } catch (err) {
        console.error('Error fetching stores:', err);
        res.status(500).send('Error retrieving store data');
    }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve the homepage
app.get('/public', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/', (req, res) => {
    res.send('Server is running. Welcome to JkpgCity!');
});

app.get('/favicon.ico', (req, res) => res.status(204)); // Ignore Favicon request (Provided by ChatGPT)

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
}); 