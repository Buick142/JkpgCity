const { Client } = require("pg");

const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "1234",
    port: 5432,
});

async function connectDB() {
    try{
        await client.connect();
        console.log('Connected to PostgreSQL database');
    } catch (err) {
        console.error('Connection error', err.stack);
    }
}

function createTableStores() {
    const createStoresQuery = `
    CREATE TABLE IF NOT EXISTS Stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url TEXT,
    district VARCHAR(255)
    );`;
    client.query(createStoresQuery)
        .then(() => console.log('Table "Stores" created'))
        .catch(err = console.error('Could not create table "Stores"', err.stack));
}
 
async function getAllStores() {
    const selectQuery = 'SELECT * FROM Stores';
    try {
        const res = await client.query(selectQuery);
        console.log(res.rows);
        return res.rows
    } catch (err) {
        console.error('Error selecting stores from Stores', err.stack);
    }
}

module.exports = { getAllStores };