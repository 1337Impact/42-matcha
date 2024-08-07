import app from "./src/app";
import dotenv from "dotenv";
import db from "./src/utils/db/client";

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  process.stdout.write('\x1Bc');
  console.log(`Server is running on port ${PORT}`);
});
