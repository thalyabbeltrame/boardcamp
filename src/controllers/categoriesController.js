import chalk from "chalk";

import connection from "../dbStrategy/postgres.js";

const getCategories = async (_req, res) => {
  try {
    const { rows: categories } = await connection.query(
      "SELECT * FROM categories"
    );
    res.status(200).send(categories);
  } catch (error) {
    console.log(chalk.red(error));
  }
};

const createCategory = async (req, res) => {
  const { name } = req.body;

  try {
    await connection.query("INSERT INTO categories (name) VALUES ($1)", [name]);
    return res.status(201).send("Category created");
  } catch (error) {
    console.log(chalk.red(error));
  }
};

export { getCategories, createCategory };
