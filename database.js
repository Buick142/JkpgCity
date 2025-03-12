const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "1234",
    port: 5432,
});


async function connectDB() {
    try{
        await pool.connect();
        console.log('Connected to PostgreSQL database');
    } catch (err) {
        console.error('Connection error', err.stack);
    }
}

async function createTableStores() {

    const dropTableQuery = `DROP TABLE IF EXISTS Stores;`;

    try {
        await pool.query(dropTableQuery);
        console.log('Table Store dropped')

        const createStoresQuery = `
        CREATE TABLE IF NOT EXISTS Stores (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        url TEXT,
        district VARCHAR(255)
        );`;

        await pool.query(createStoresQuery);
        console.log('Table "Stores" is ready');

    } catch (err) {
        console.error('Could not create table "Stores"', err.stack);
    }
}

// Insert data from stores.json into the database
async function insertStoresFromJSON() {
    const jsonFilePath = path.join(__dirname, "api", "stores", "stores.json");

    // Check if the file exists
    if (!fs.existsSync(jsonFilePath)) {
        console.error("stores.json file is missing!");
        return;
    }

    const storesData = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));

    for (const store of storesData) {
        try {
            // Insert only if the store name does not already exist
            await pool.query(
                "INSERT INTO Stores (name, url, district) VALUES ($1, $2, $3) ON CONFLICT (name) DO NOTHING",
                [store.name, store.url, store.district]
            );
            console.log(`Inserted store: ${store.name}`);
        } catch (err) {
            console.error(`Error inserting store "${store.name}":`, err.stack);
        }
    }
}

async function getAllStores() {
    const selectQuery = 'SELECT * FROM Stores';
    try {
        const res = await pool.query(selectQuery);
        console.log(res.rows);
        return res.rows;
    } catch (err) {
        console.error('Error selecting stores from Stores', err.stack);
    }
}

// Run setup functions
(async () => {
    await connectDB();
    await createTableStores();
    await insertStoresFromJSON();
})();

connectDB();

module.exports = { getAllStores, createTableStores, pool };