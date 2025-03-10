const express = require('express');
const db = require('./database.js')

const app = express();
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
}); 