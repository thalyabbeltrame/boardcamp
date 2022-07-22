import Joi from "joi";

import connection from "../dbStrategy/postgres.js";

const { rows: categoryNames } = await connection.query(
  `SELECT name FROM categories`
);
const invalidCategoryNames = categoryNames?.map(({ name }) => name);

const categorySchema = Joi.object({
  name: Joi.string()
    .trim()
    .invalid(...invalidCategoryNames)
    .required(),
});

export default categorySchema;
