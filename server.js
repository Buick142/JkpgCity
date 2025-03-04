const { Client } = require("pg");

const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "1234",
    port: 5432,
});

async function createDatabase() {
    try {
        await client.connect();
        const result = await client.query("SELECT * FROM vendors");
        console.log(result.rows);
    } catch (err) {
        console.error("Error creating database:", err);
    } finally {
        await client.end();
    } 
}

createDatabase();