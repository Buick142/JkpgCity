const express = require('express');
const { getAllStores, createTableStores, pool } = require('./database.js');
const cookieParser = require('cookie-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 3000;
const fs = require('fs');

// Middleware
app.use(express.json());
app.use(cookieParser());

// Ensure table Stores is created before running the database
createTableStores();

// Array of valid district options
const validDistricts = ["Väster", "Öster", "Tändsticksområdet", "Atollen", null];

// READ - API route setup
app.get('/api/stores', async (req, res) => {
    try {
        const stores = await getAllStores();
        if (stores.length > 0) {
            return res.json(stores); // Send JSON response from DB
        } 
        throw new Error("No stores in DB.");

    // Use stores.json if database is not found
    } catch (err) {
        console.warn("Database empty. Using stores.json instead.");

        // Check if stores.json exists before reading
        const jsonFilePath = path.join(__dirname, 'api', 'stores', 'stores.json');
        if (!fs.existsSync(jsonFilePath)) {
            console.error("stores.json not found!");
            return res.status(500).json({ error: "stores.json file is missing" });
        }

        // Read JSON file
        fs.readFile(jsonFilePath, 'utf8', (fileErr, data) => {
            if (fileErr) {
                console.error("Error reading stores.json:", fileErr);
                return res.status(500).json({ error: "Failed to load stores.json" });
            } try {
                const stores = JSON.parse(data);
                res.json(stores); // Send JSON file stores
            } catch (parseErr) {
                console.error("Error parsing stores.json:", parseErr);
                res.status(500).json({ error: "Error parsing stores.json" });
            }
        });
    }
});

// Send POST request to CREATE a store
app.post('/api/stores', async (req, res) => {
    const { name, url, district } = req.body;

    if (!name) { 
        return res.status(400).json({ error: "Name is required" });
    }
    if (district && !validDistricts.includes(district)) {
        return res.status(400).json({ error: "Invalid district" });
    }

    try {
        const result = await pool.query('INSERT INTO Stores (name, url, district) VALUES ($1, $2, $3) RETURNING *', [name, url, district]);
        res.status(201).json({ 
            store: result.rows[0] ,
            message: 'Store added successfully' 
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add store' });
    }
});

// Send PUT request to UPDATE a store
app.put('/api/stores/:id', async (req, res) => {
    const { id } = req.params;
    const { name, url, district } = req.body;

    if (!name || !url || !validDistricts.includes(district)) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        const result = await pool.query(
            'UPDATE Stores SET name = $1, url = $2, district = $3 WHERE id = $4 RETURNING *',
            [name, url, district, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Store not found" });
        }

        res.json({ store: result.rows[0] , message: "Store deleted successfully" });
    } catch (err) {
        console.error("Error updating store:", err);
        res.status(500).json({ error: "Failed to update store" });
    }
});

// Send DELETE request to DELETE a store
app.delete('/api/stores/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM Stores WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Store not found" });
        }

        res.json({ store: result.rows[0] , message: "Store deleted successfully" });
    } catch (err) {
        console.error("Error deleting store:", err);
        res.status(500).json({ error: "Failed to delete store" });
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

// Ignore Favicon request
app.get('/favicon.ico', (req, res) => res.status(204));

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
}); 