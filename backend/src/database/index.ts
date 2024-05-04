import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.DB_HOST,
    database: process.env.PGDATABASE,
    password: process.env.DB_PASS,
    port: parseInt(process.env.PGPORT ?? ""),
});

pool.connect((err, client, release) => {
    if (err) {
        console.error("Error connecting to database", err);
    } else {
        client && client.query("SELECT 1", [], (err, result) => {
            release();
            if (err) {
                console.error("Error executing query", err);
            } else {
                console.log("Database is running");
            }
        });
    }
});

export default pool;