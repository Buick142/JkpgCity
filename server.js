const express = require('express');
const db = require('./database.js')

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Server is running. Welcome to JkpgCity!');
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
}); 