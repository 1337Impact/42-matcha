import app from "./src/app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  process.stdout.write('\x1Bc');
  //`Server is running on port ${PORT}`);
});
