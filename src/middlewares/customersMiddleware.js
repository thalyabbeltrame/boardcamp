import chalk from "chalk";
import { stripHtml } from "string-strip-html";

import connection from "../dbStrategy/postgres.js";

import customerSchema from "../schemas/customerSchema.js";

const validateCustomer = (req, res, next) => {
  try {
    const { error } = customerSchema.validate(
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

const validateCustomerId = async (req, res, next) => {
  const { id } = req.params;
  if (isNaN(id) || id % 1) return res.sendStatus(400);

  try {
    const { rows: customer } = await connection.query(
      `
        SELECT 
          customers.*, 
          birthday::VARCHAR 
        FROM customers 
        WHERE id = ($1)
      `,
      [id]
    );
    if (customer.length === 0) return res.sendStatus(404);

    res.locals.customer = customer[0];
    next();
  } catch (error) {
    console.log(chalk.red(error));
    res.sendStatus(500);
  }
};

const checkIfCpfAlreadyExists = async (req, res, next) => {
  const cpf = stripHtml(req.body.cpf).result.trim();

  try {
    const { rows: customer } = await connection.query(
      `
        SELECT * FROM customers 
        WHERE cpf = ($1)
      `,
      [cpf]
    );
    if (customer.length > 0) return res.sendStatus(409);

    next();
  } catch (error) {
    console.log(chalk.red(error));
    res.sendStatus(500);
  }
};

const checkIfCpfAlreadyExistsAndIsNotTheSameUser = async (req, res, next) => {
  const cpf = stripHtml(req.body.cpf).result.trim();
  const { id } = req.params;

  try {
    const { rows: customer } = await connection.query(
      `
        SELECT * FROM customers 
        WHERE cpf = ($1) AND id <> ($2)
      `,
      [cpf, id]
    );
    if (customer.length > 0) return res.sendStatus(409);

    next();
  } catch (error) {
    console.log(chalk.red(error));
    res.sendStatus(500);
  }
};

export {
  validateCustomer,
  validateCustomerId,
  checkIfCpfAlreadyExists,
  checkIfCpfAlreadyExistsAndIsNotTheSameUser,
};
