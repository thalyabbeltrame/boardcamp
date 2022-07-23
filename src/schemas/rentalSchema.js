import Joi from "joi";

import connection from "../dbStrategy/postgres.js";

const { rows: customerIds } = await connection.query(
  `SELECT id FROM customers`
);
const validCustomerIds = customerIds?.map(({ id }) => id);

const { rows: gameIds } = await connection.query(`SELECT id FROM games`);
const validGameIds = gameIds?.map(({ id }) => id);

const rentalSchema = Joi.object({
  customerId: Joi.number()
    .integer()
    .positive()
    .valid(...validCustomerIds)
    .required(),
  gameId: Joi.number()
    .integer()
    .positive()
    .valid(...validGameIds)
    .required(),
  daysRented: Joi.number().integer().positive().required(),
});

export default rentalSchema;
