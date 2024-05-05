import app from "./src/app";
import dotenv from "dotenv";
import db from "./src/database/client";

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
