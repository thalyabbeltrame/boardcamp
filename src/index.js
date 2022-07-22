import express, { json } from "express";
import cors from "cors";
import chalk from "chalk";
import { config as dotenvConfig } from "dotenv";

import router from "./routes/index.js";

dotenvConfig();

const port = process.env.PORT || 4000;
const app = express();

app.use(json());
app.use(cors());
app.use(router);

app.listen(port, () => {
  console.log(chalk.bgGreen.black.bold(`Server running on port ${port}...`));
});
