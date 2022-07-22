import Joi from "joi";

import connection from "../dbStrategy/postgres.js";

const { rows: categoriesNames } = await connection.query(
  `SELECT name FROM categories`
);

const invalidCategoriesNames = categoriesNames?.map(({ name }) => name);

const categorySchema = Joi.object({
  name: Joi.string()
    .trim()
    .invalid(...invalidCategoriesNames)
    .required(),
});

export default categorySchema;
