const express = require('express');
const { getAllStores, createTableStores } = require('/database.js');
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
        if (stores && stores.length > 0) {
            return res.json(stores); // Send JSON response from DB
        } else {
            console.warn("Database empty. Using stores from json instead.");
            throw new Error("No stores in DB.");
        }
    } catch (err) {
        console.error('Error fetching stores:', err);
        res.status(500).send('Error retrieving store data');
    }

    // Fallback to reading from stores.json
    fs.readFile(path.join(__dirname, 'stores.json'), 'utf8', (fileErr, data) => {
        if (fileErr) {
            console.error('Error reading stores.json:', fileErr);
            return res.status(500).json({ error: 'Error retrieving store data' });
        }

        try {
            const stores = JSON.parse(data);
            res.json(stores); // Send JSON from file
        } catch (parseErr) {
            console.error('Error parsing stores.json:', parseErr);
            res.status(500).json({ error: 'Error parsing store data' });
        }
    });
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