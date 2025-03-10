const express = require('express');
const db = require('./database.js');
const { getAllStores } = require('./database.js');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/api/stores', (req, res) => {
    const stores = getAllStores();
    res.json(stores);
})

app.get('/', (req, res) => {
    res.send('Server is running. Welcome to JkpgCity!');
});

app.get('/favicon.ico', (req, res) => res.status(204)); // Ignore Favicon request (Provided by ChatGPT)

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
}); 