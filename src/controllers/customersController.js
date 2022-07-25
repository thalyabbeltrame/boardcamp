import chalk from "chalk";
import dayjs from "dayjs";

import connection from "../dbStrategy/postgres.js";

const getCustomers = async (req, res) => {
  const cpf = req.query.cpf || "";
  const { limit, offset } = req.query;

  try {
    const { rows: customers } = await connection.query(
      `
        SELECT 
          customers.*, 
          birthday::VARCHAR 
        FROM customers 
        WHERE cpf LIKE ($1)
        LIMIT ($2) OFFSET ($3)
      `,
      [`${cpf}%`, limit, offset]
    );

    res.status(200).send(customers);
  } catch (error) {
    console.log(chalk.red(error));
    res.sendStatus(500);
  }
};

const getCustomerById = async (_req, res) => {
  const { customer } = res.locals;

  res.status(200).send(customer);
};

const createCustomer = async (req, res) => {
  const { name, phone, cpf, birthday } = req.body;

  try {
    await connection.query(
      `
        INSERT INTO customers (name, phone, cpf, birthday) 
        VALUES ($1, $2, $3, $4)
      `,
      [name, phone, cpf, birthday]
    );

    res.sendStatus(201);
  } catch (error) {
    console.log(chalk.red(error));
    res.sendStatus(500);
  }
};

const updateCustomer = async (req, res) => {
  const { name, phone, cpf, birthday } = req.body;
  const { id } = req.params;

  try {
    await connection.query(
      `
        UPDATE customers 
        SET name = ($1), phone = ($2), cpf = ($3), birthday = ($4) 
        WHERE id = ($5)
      `,
      [name, phone, cpf, birthday, id]
    );

    res.sendStatus(200);
  } catch (error) {
    console.log(chalk.red(error));
    res.sendStatus(500);
  }
};

export { getCustomers, getCustomerById, createCustomer, updateCustomer };
