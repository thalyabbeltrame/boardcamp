import Joi from "joi";

import connection from "../dbStrategy/postgres.js";

const { rows: categoryIds } = await connection.query(
  `SELECT id FROM categories`
);
const validCategoryIds = categoryIds?.map(({ id }) => id);

const gameSchema = Joi.object({
  name: Joi.string().trim().required(),
  image: Joi.string().required(),
  stockTotal: Joi.number().integer().greater(0).required(),
  categoryId: Joi.valid(...validCategoryIds).required(),
  pricePerDay: Joi.number().integer().greater(0).required(),
});

export default gameSchema;
