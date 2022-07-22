import chalk from "chalk";

import categorySchema from "../schemas/categorySchema.js";

const validateCategory = (req, res, next) => {
  const { name } = req.body;

  try {
    const { error } = categorySchema.validate({ name });

    if (error && error.details[0].type === "string.empty")
      return res.status(400).send("Category name must not be empty");

    if (error && error.details[0].type === "any.invalid")
      return res.status(409).send("Category name already exists");

    if (error) return res.status(422).send(error.details[0].message);

    next();
  } catch (error) {
    console.log(chalk.red(error));
  }
};

export { validateCategory };
