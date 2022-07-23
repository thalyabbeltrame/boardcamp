import chalk from "chalk";

import connection from "../dbStrategy/postgres.js";

import categorySchema from "../schemas/categorySchema.js";

const validateCategory = (req, res, next) => {
  const { name } = req.body;

  try {
    const { error } = categorySchema.validate({ name });
    if (error) return res.sendStatus(400);

    next();
  } catch (error) {
    console.log(chalk.red(error));
    res.sendStatus(500);
  }
};

const checkIfCategoryNameAlreadyExists = async (req, res, next) => {
  const { name } = req.body;

  try {
    const { rows: category } = await connection.query(
      `SELECT * FROM categories WHERE name = ($1)`,
      [name]
    );

    if (category.length > 0) return res.sendStatus(409);

    next();
  } catch (error) {
    console.log(chalk.red(error));
    res.sendStatus(500);
  }
};

export { validateCategory, checkIfCategoryNameAlreadyExists };
