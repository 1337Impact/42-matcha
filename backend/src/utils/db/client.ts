import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();
//"data: ", process.env.DATABASE_URL);
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

pool.connect((err, client, release) => {
    if (err) {
        console.error("Error connecting to database", err);
    } else {
        client && client.query("SELECT 1", [], (err, result) => {
            release();
            if (err) {
                console.error("Error executing query", err);
            } else {
                console.log("Database is running...");
            }
        });
    }
});

export default pool;