import chalk from "chalk";
import { stripHtml } from "string-strip-html";

import connection from "../dbStrategy/postgres.js";

import categorySchema from "../schemas/categorySchema.js";

const validateCategory = (req, res, next) => {
  try {
    const { error } = categorySchema.validate(
      { ...req.body },
      { abortEarly: false }
    );
    if (error)
      return res.status(400).send(error.details.map(({ message }) => message));

    next();
  } catch (error) {
    console.log(chalk.red(error));
    res.sendStatus(500);
  }
};

const checkIfCategoryNameAlreadyExists = async (req, res, next) => {
  const name = stripHtml(req.body.name).result.trim();

  try {
    const { rows: category } = await connection.query(
      `
        SELECT * FROM categories 
        WHERE name = ($1)
      `,
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
