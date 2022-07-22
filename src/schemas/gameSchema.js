import Joi from "joi";

import connection from "../dbStrategy/postgres.js";

const { rows: categoryIds } = await connection.query(
  `SELECT id FROM categories`
);
const validCategoryIds = categoryIds?.map(({ id }) => id);

const { rows: gameNames } = await connection.query(`SELECT name FROM games`);
const invalidGameNames = gameNames?.map(({ name }) => name);

const gameSchema = Joi.object({
  name: Joi.string()
    .trim()
    .invalid(...invalidGameNames)
    .required(),
  image: Joi.string().required(),
  stockTotal: Joi.number().integer().positive().required(),
  categoryId: Joi.number()
    .integer()
    .valid(...validCategoryIds)
    .required(),
  pricePerDay: Joi.number().positive().required(),
});

export default gameSchema;
