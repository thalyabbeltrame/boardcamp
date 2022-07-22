import chalk from "chalk";
import pg from "pg";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const { Pool } = pg;

const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
});

try {
  connection.connect();
  console.log(chalk.bgGreen.black.bold("Connected to Postgres!"));
} catch (error) {
  console.log(chalk.bgRed.black.bold("Error connecting to Postgres!"));
  console.log(error);
}

export default connection;
