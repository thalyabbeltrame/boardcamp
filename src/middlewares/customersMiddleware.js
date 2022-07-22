import chalk from "chalk";

import customerSchema from "../schemas/customerSchema.js";

const validateCustomer = (req, res, next) => {
  try {
    const { error } = customerSchema.validate({ ...req.body });

    if (error && error.details[0].type === "any.invalid")
      return res.status(409).send("CPF already exists");

    if (error) return res.status(400).send(error.details[0].message);

    next();
  } catch (error) {
    console.log(chalk.red(error));
    res.sendStatus(500);
  }
};

export default validateCustomer;
