import chalk from "chalk";
import dayjs from "dayjs";

import connection from "../dbStrategy/postgres.js";

const getCustomers = async (req, res) => {
  const cpf = req.query.cpf || "";

  try {
    const { rows: customers } = await connection.query(
      "SELECT * FROM customers WHERE cpf LIKE ($1)",
      [`${cpf}%`]
    );
    res.status(200).send(
      customers.map((customer) => ({
        ...customer,
        birthday: dayjs(customer.birthday).format("YYYY-MM-DD"),
      }))
    );
  } catch (error) {
    console.log(chalk.red(error));
    res.sendStatus(500);
  }
};

const getCustomerById = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows: customer } = await connection.query(
      "SELECT * FROM customers WHERE id = ($1)",
      [id]
    );

    if (customer.length === 0) return res.sendStatus(404);

    res.status(200).send(
      customer.map((customer) => ({
        ...customer,
        birthday: dayjs(customer.birthday).format("YYYY-MM-DD"),
      }))[0]
    );
  } catch (error) {
    console.log(chalk.red(error));
    res.sendStatus(500);
  }
};

const createCustomer = async (req, res) => {
  const { name, phone, cpf, birthday } = req.body;

  try {
    await connection.query(
      "INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)",
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

  // todo: fix cpf validator

  try {
    await connection.query(
      "UPDATE customers SET name = ($1), phone = ($2), cpf = ($3), birthday = ($4) WHERE id = ($5)",
      [name, phone, cpf, birthday, id]
    );

    res.sendStatus(204);
  } catch (error) {
    console.log(chalk.red(error));
    res.sendStatus(500);
  }
};

export { getCustomers, getCustomerById, createCustomer, updateCustomer };
